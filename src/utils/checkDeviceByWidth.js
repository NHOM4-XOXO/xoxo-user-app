export const checkDeviceByWidth = {
  mobile: (width) => width < 768,
  tablet: (width) => width >= 768 && width < 1024,
  desktop: (width) => width >= 1024,
};
