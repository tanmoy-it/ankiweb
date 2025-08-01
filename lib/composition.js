import * as React from "react";

/**
 * A utility to compose multiple event handlers into a single event handler.
 * Call originalEventHandler first, then ourEventHandler unless prevented.
 */
function composeEventHandlers(
  originalEventHandler,
  ourEventHandler,
  { checkForDefaultPrevented = true } = {}
) {
  return function handleEvent(event) {
    originalEventHandler?.(event);

    if (
      checkForDefaultPrevented === false ||
      !(event).defaultPrevented
    ) {
      return ourEventHandler?.(event);
    }
  };
}

/**
 * Set a given ref to a given value.
 * This utility takes care of different types of refs: callback refs and RefObject(s).
 */
function setRef(ref, value) {
  if (typeof ref === "function") {
    return ref(value);
  }

  if (ref !== null && ref !== undefined) {
    ref.current = value;
  }
}

/**
 * A utility to compose multiple refs together.
 * Accepts callback refs and RefObject(s).
 */
function composeRefs(...refs) {
  return (node) => {
    let hasCleanup = false;
    const cleanups = refs.map((ref) => {
      const cleanup = setRef(ref, node);
      if (!hasCleanup && typeof cleanup === "function") {
        hasCleanup = true;
      }
      return cleanup;
    });

    // React <19 will log an error to the console if a callback ref returns a
    // value. We don't use ref cleanups internally so this will only happen if a
    // user's ref callback returns a value, which we only expect if they are
    // using the cleanup functionality added in React 19.
    if (hasCleanup) {
      return () => {
        for (let i = 0; i < cleanups.length; i++) {
          const cleanup = cleanups[i];
          if (typeof cleanup === "function") {
            cleanup();
          } else {
            setRef(refs[i], null);
          }
        }
      };
    }
  };
}

/**
 * A custom hook that composes multiple refs.
 * Accepts callback refs and RefObject(s).
 */
function useComposedRefs(...refs) {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return React.useCallback(composeRefs(...refs), refs);
}

export { composeEventHandlers, composeRefs, useComposedRefs };
