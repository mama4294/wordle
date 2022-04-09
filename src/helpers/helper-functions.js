import { useEffect, useRef } from "react";

const useEventLister = (eventName, handler, element = window) => {
  const savedHandler = useRef();

  // Update saved handler if handler changes
  useEffect(() => {
    savedHandler.current = handler;
  }, [handler]);

  useEffect(() => {
    const isSupported = element && element.addEventListener;
    if (!isSupported) return;

    const eventListener = (event) => savedHandler.current(event);
    element.addEventListener(eventName, eventListener);

    //Cleanup
    return () => {
      element.removeEventListener(eventName, eventListener);
    };
  }, [eventName, element]);
};

export const isLetter = (c) => {
  return /^[A-Z]$/i.test(c);
};

export default useEventLister;
