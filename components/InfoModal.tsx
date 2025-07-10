import React, { ReactNode } from 'react';

interface InfoModalProps {
  onClose: () => void;
  title: string;
  children: ReactNode;
}

export const InfoModal: React.FC<InfoModalProps> = ({ onClose, title, children }) => {
  // Close modal on escape key press
  React.useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50 transition-opacity duration-300 ease-in-out"
      onClick={onClose} // Close on backdrop click
    >
      <div 
        className="bg-white p-6 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto text-slate-700"
        onClick={(e) => e.stopPropagation()} // Prevent content click from closing modal
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-emerald-600">{title}</h2>
          <button 
            onClick={onClose} 
            className="text-slate-500 hover:text-emerald-600 transition-colors"
            aria-label="Close modal"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div>
          {children}
        </div>
      </div>
    </div>
  );
};