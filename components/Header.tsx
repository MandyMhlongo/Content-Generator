import React from 'react';

interface HeaderProps {
  onInfoClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onInfoClick }) => {
  return (
    <header className="w-full max-w-4xl text-center mb-6 md:mb-10">
      <div className="flex justify-between items-center">
        <div></div> {/* Spacer */}
        <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-green-500">
          Mandy's Creative Content Generator
        </h1>
        <button
          onClick={onInfoClick}
          className="p-2 text-slate-500 hover:text-emerald-600 transition-colors"
          title="Prompt Engineering Info"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7">
            <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
          </svg>
        </button>
      </div>
      <p className="mt-2 text-lg text-slate-600">
        Unleash your creativity with AI-powered content generation.
      </p>
    </header>
  );
};