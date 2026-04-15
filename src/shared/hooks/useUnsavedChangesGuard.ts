import { useEffect, useCallback } from 'react';
import { useBeforeUnload, useBlocker } from 'react-router-dom';

// hook to prevent users from accidentally losing unsaved changes
// handles both browser navigation (close tab, refresh) and react-router navigation
export function useUnsavedChangesGuard(isDirty: boolean, message = 'You have unsaved changes. Are you sure you want to leave?') {

  // browser-level navigation guard
  useBeforeUnload(
    useCallback(
      (e: BeforeUnloadEvent) => {
        if (isDirty) {
          e.preventDefault();
          e.returnValue = message; // browsers show their own message, but we set it anyway
        }
      },
      [isDirty, message]
    )
  );

  // react router navigation guard
  const blocker = useBlocker(
    useCallback(() => isDirty, [isDirty])
  );

  useEffect(() => {
    if (blocker.state === 'blocked') {
      const proceed = window.confirm(message);
      if (proceed) {
        blocker.proceed(); // let them leave
      } else {
        blocker.reset(); // keep them on the page
      }
    }
  }, [blocker, message]);
}
