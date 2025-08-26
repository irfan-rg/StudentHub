import React, { useState } from 'react';

// Base64 encoded SVG for fallback image display
const ERROR_IMG_SRC =
  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODgiIGhlaWdodD0iODgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgc3Ryb2tlPSIjMDAwIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBvcGFjaXR5PSIuMyIgZmlsbD0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIzLjciPjxyZWN0IHg9IjE2IiB5PSIxNiIgd2lkdGg9IjU2IiBoZWlnaHQ9IjU2IiByeD0iNiIvPjxwYXRoIGQ9Im0xNiA1OCAxNi0xOCAzMiAzMiIvPjxjaXJjbGUgY3g9IjUzIiBjeT0iMzUiIHI9IjciLz48L3N2Zz4KCg=='

/**
 * ImageWithFallback Component
 * 
 * A robust image component that displays a fallback when the original image fails to load.
 * This component handles image loading errors gracefully and provides visual feedback.
 * 
 * Props:
 * - src: Image source URL
 * - alt: Alternative text for accessibility
 * - className: CSS classes to apply
 * - style: Inline styles object
 * - ...rest: Any other standard img element props
 * 
 * Features:
 * - Automatic fallback on image load error
 * - Preserves original styling and dimensions
 * - Maintains accessibility with proper alt text
 * - Tracks original URL for debugging purposes
 */
export function ImageWithFallback(props) {
  const [didError, setDidError] = useState(false);

  const handleError = () => {
    setDidError(true);
  };

  const { src, alt, style, className, ...rest } = props;

  // If image failed to load, show fallback UI
  if (didError) {
    return (
      <div
        className={`inline-block bg-gray-100 text-center align-middle ${className || ''}`}
        style={style}
        role="img"
        aria-label={alt || 'Image failed to load'}
      >
        <div className="flex items-center justify-center w-full h-full">
          <img 
            src={ERROR_IMG_SRC} 
            alt="Error loading image" 
            {...rest} 
            data-original-url={src}
            className="opacity-30"
          />
        </div>
      </div>
    );
  }

  // Render normal image with error handling
  return (
    <img 
      src={src} 
      alt={alt} 
      className={className} 
      style={style} 
      {...rest} 
      onError={handleError}
    />
  );
}

/**
 * Default export for easier importing
 */
export default ImageWithFallback;