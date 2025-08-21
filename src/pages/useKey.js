import { useEffect, useRef } from "react";

const useKey = (key, cd) => {
  const callbackRef = useRef();

  useEffect(() => {
    callbackRef.current = cd;
  });
  useEffect(() => {
    function handel(event) {
      event.preventDefault();
      
      if (event.keyCode === key) {
        callbackRef.current(event);
      }
    }
    document.addEventListener("keypress", handel);
    return () => document.removeEventListener("keypress", handel);
  }, [key]);
};
export default useKey;
