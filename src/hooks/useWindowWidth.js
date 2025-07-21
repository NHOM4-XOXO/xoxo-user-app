import { useState, useEffect } from "react";

export default function useWindowWidth() {
  const [windowWidth, setWindowWidth] = useState(0);
  const windowWidthType = {
    mobile: (width) => width < 768,
    tablet: (width) => width >= 768 && width < 1024,
    desktop: (width) => width >= 1024,
  };

  useEffect(() => {
    setWindowWidth(window.innerWidth);

    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return {
    windowWidth,
    windowWidthType,
  };
}
