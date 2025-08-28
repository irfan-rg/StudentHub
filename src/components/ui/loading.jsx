import React from 'react';

export function LoadingSpinner({ size = 'default', text = 'Loading...', className = '' }) {
  const sizeClasses = {
    small: 'h-6 w-6',
    default: 'h-8 w-8',
    large: 'h-12 w-12'
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className="text-center">
        <div className={`animate-spin rounded-full border-b-2 border-blue-600 mx-auto mb-2 ${sizeClasses[size]}`}></div>
        {text && <p className="text-gray-600 dark:text-gray-300">{text}</p>}
      </div>
    </div>
  );
}

export function FullPageLoading({ text = 'Loading your Student Hub...' }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="large" text={text} />
      </div>
    </div>
  );
}
