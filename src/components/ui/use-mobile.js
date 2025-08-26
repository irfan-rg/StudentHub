// Custom hook for detecting mobile devices
// Replacement for the TypeScript use-mobile.ts file

import { useState, useEffect } from 'react';

/**
 * Hook to detect if the current device is mobile based on screen width
 * @param {number} breakpoint - The breakpoint in pixels (default: 768px)
 * @returns {boolean} - True if the screen width is below the breakpoint
 */
export function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Function to check if current width is below breakpoint
    const checkDevice = () => {
      setIsMobile(window.innerWidth < breakpoint);
    };

    // Check on initial load
    checkDevice();

    // Add event listener for window resize
    window.addEventListener('resize', checkDevice);

    // Cleanup event listener on component unmount
    return () => window.removeEventListener('resize', checkDevice);
  }, [breakpoint]);

  return isMobile;
}

/**
 * Hook to get current window dimensions
 * Useful for responsive design and layout calculations
 */
export function useWindowSize() {
  const [windowSize, setWindowSize] = useState({
    width: undefined,
    height: undefined,
  });

  useEffect(() => {
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }

    // Set initial size
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowSize;
}

/**
 * Hook to detect device type based on user agent
 * More comprehensive than just screen width
 */
export function useDeviceType() {
  const [deviceType, setDeviceType] = useState('desktop');

  useEffect(() => {
    const userAgent = navigator.userAgent.toLowerCase();
    const isMobile = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
    const isTablet = /ipad|android(?!.*mobile)/i.test(userAgent);

    if (isMobile && !isTablet) {
      setDeviceType('mobile');
    } else if (isTablet) {
      setDeviceType('tablet');
    } else {
      setDeviceType('desktop');
    }
  }, []);

  return deviceType;
}

/**
 * Hook for detecting touch device capability
 * Useful for showing/hiding touch-specific UI elements
 */
export function useIsTouchDevice() {
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    const checkTouch = () => {
      setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);
    };

    checkTouch();
  }, []);

  return isTouchDevice;
}