import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@api/queryClient';
import { router } from '@app/app/routes/router';
import { ErrorBoundary } from '@shared/components/ErrorBoundary';
import { logger } from '@shared/services/logger';
import './index.css';

// catch all unhandled errors and log them
window.onerror = (message, source, lineno, colno, error) => {
  logger.error('Unhandled window error', {
    message: String(message),
    source: String(source ?? ''),
    line: lineno ?? 0,
    col: colno ?? 0,
    error: error?.stack ?? '',
  });
};

window.onunhandledrejection = (event: PromiseRejectionEvent) => {
  logger.error('Unhandled promise rejection', {
    reason: String(event.reason),
  });
};

async function bootstrap() {
  // MSW for API mocking in dev mode - makes frontend dev so much easier
  if (import.meta.env.DEV) {
    const { worker } = await import('@api/mocks/browser');
    await worker.start({ onUnhandledRequest: 'bypass' });
  }

  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <ErrorBoundary>
        <QueryClientProvider client={queryClient}>
          <RouterProvider router={router} />
        </QueryClientProvider>
      </ErrorBoundary>
    </React.StrictMode>
  );
}

bootstrap();
