import { useState, useEffect } from "react";

export default function useWindowHeight() {
  const [windowHeight, setWindowHeight] = useState(0);

  useEffect(() => {
    // Set initial height on mount
    setWindowHeight(window.innerHeight);

    const handleResize = () => {
      setWindowHeight(window.innerHeight);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return windowHeight;
}
