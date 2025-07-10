import React from 'react';

interface LoadingSpinnerProps {
  small?: boolean;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ small = false }) => {
  const sizeClasses = small ? 'w-5 h-5' : 'w-12 h-12';
  const borderClasses = small ? 'border-2' : 'border-4';

  return (
    <div className={`animate-spin rounded-full ${sizeClasses} ${borderClasses} border-emerald-500 border-t-transparent`} role="status">
      <span className="sr-only">Loading...</span>
    </div>
  );
};