import React from 'react';
import { cn } from '@/lib/utils';

export const Input = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <input
      ref={ref}
      className={cn(
        'flex h-10 w-full mb-3 rounded-xl border bg-gray-700 px-4 py-2 text-sm text-gray-200 placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
        className
      )}
      {...props}
    />
  );
});

Input.displayName = 'Input';
