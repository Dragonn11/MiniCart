import { useEffect, useCallback } from 'react';
import { useBeforeUnload, useBlocker } from 'react-router-dom';

// hook to prevent losing unsaved changes
export function useUnsavedChangesGuard(
  isDirty: boolean,
  message = 'You have unsaved changes. Are you sure you want to leave?'
) {
  // browser-level navigation guard
  useBeforeUnload(
    useCallback(
      (e: BeforeUnloadEvent) => {
        if (isDirty) {
          e.preventDefault();
          e.returnValue = message;
        }
      },
      [isDirty, message]
    )
  );

  // navigation guard
  const blocker = useBlocker(useCallback(() => isDirty, [isDirty]));

  useEffect(() => {
    if (blocker.state === 'blocked') {
      const proceed = window.confirm(message);
      if (proceed) {
        blocker.proceed(); 
      } else {
        blocker.reset();
      }
    }
  }, [blocker, message]);
}
