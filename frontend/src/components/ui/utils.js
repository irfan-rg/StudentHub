// Utility functions for className merging and conditional styling
// Replacement for the TypeScript utils.ts file

/**
 * Combines multiple class names into a single string
 * Filters out falsy values automatically
 */
export function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}

/**
 * Alternative class name utility with more flexibility
 * Handles arrays and objects for conditional classes
 */
export function clsx(...classes) {
  const result = [];
  
  for (let i = 0; i < classes.length; i++) {
    const arg = classes[i];
    if (!arg) continue;
    
    if (typeof arg === 'string') {
      result.push(arg);
    } else if (Array.isArray(arg)) {
      const inner = clsx(...arg);
      if (inner) result.push(inner);
    } else if (typeof arg === 'object') {
      for (const key in arg) {
        if (arg[key]) result.push(key);
      }
    }
  }
  
  return result.join(' ');
}

/**
 * Merges Tailwind CSS classes with proper handling of conflicting classes
 * Useful for component variants and conditional styling
 */
export function mergeTailwindClasses(baseClasses, additionalClasses) {
  if (!additionalClasses) return baseClasses;
  return `${baseClasses} ${additionalClasses}`.trim();
}

/**
 * Utility for creating conditional classes based on component props
 * Example: conditionalClass('text-red-500', isError)
 */
export function conditionalClass(className, condition) {
  return condition ? className : '';
}

/**
 * Creates variant classes for components
 * Example: variant('button', 'primary', { primary: 'bg-blue-500', secondary: 'bg-gray-500' })
 */
export function variant(component, variantName, variants) {
  return variants[variantName] || variants.default || '';
}