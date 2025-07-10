import React, { useRef, useState } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { GroundingMetadata } from '../types';
import { LoadingSpinner } from './LoadingSpinner';

interface GeneratedContentDisplayProps {
  content: string;
  groundingMetadata?: GroundingMetadata;
}

export const GeneratedContentDisplay: React.FC<GeneratedContentDisplayProps> = ({ content, groundingMetadata }) => {
  const formattedContent = content.split('\n').map((paragraph, index) => (
    <p key={index} className="mb-3 last:mb-0">{paragraph || <br />}</p>
  ));

  const contentRef = useRef<HTMLDivElement>(null);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState<boolean>(false);

  const handleDownloadPdf = async () => {
    if (!contentRef.current) {
      console.error("Content area not found for PDF generation.");
      return;
    }
    setIsGeneratingPdf(true);
    try {
      const canvas = await html2canvas(contentRef.current, {
        scale: 2, // Improve resolution
        useCORS: true, // If any images are from other origins (though not expected here)
        logging: false,
      });
      const imgData = canvas.toDataURL('image/png');
      
      const pdf = new jsPDF({
        orientation: 'p', // portrait
        unit: 'mm', // millimeters
        format: 'a4', // A4 size
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      const imgProps = pdf.getImageProperties(imgData);
      const imgWidth = imgProps.width;
      const imgHeight = imgProps.height;

      // Calculate the aspect ratio to fit the image within the PDF page, maintaining aspect ratio
      const aspectRatio = imgWidth / imgHeight;
      let newImgWidth = pdfWidth - 20; // pdfWidth with some margin (10mm each side)
      let newImgHeight = newImgWidth / aspectRatio;

      if (newImgHeight > pdfHeight - 20) { // If height exceeds page height with margin
        newImgHeight = pdfHeight - 20; // pdfHeight with some margin (10mm each side)
        newImgWidth = newImgHeight * aspectRatio;
      }
      
      const xOffset = (pdfWidth - newImgWidth) / 2;
      const yOffset = 10; // 10mm margin from top

      pdf.addImage(imgData, 'PNG', xOffset, yOffset, newImgWidth, newImgHeight);
      
      const timestamp = new Date().toISOString().slice(0, 19).replace(/[-:T]/g, '');
      pdf.save(`Mandy_Creative_Content_${timestamp}.pdf`);

    } catch (error) {
      console.error("Error generating PDF:", error);
      // Optionally, show an error message to the user
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  return (
    <div className="mt-8">
      <div ref={contentRef} className="p-6 bg-gray-50 rounded-lg shadow-inner">
        <h3 className="text-xl font-semibold text-emerald-600 mb-4">Generated Content:</h3>
        <div className="prose prose-sm max-w-none text-slate-700 whitespace-pre-wrap">
          {formattedContent}
        </div>
        {groundingMetadata && groundingMetadata.groundingChunks && groundingMetadata.groundingChunks.length > 0 && (
          <div className="mt-6 pt-4 border-t border-gray-300">
            <h4 className="text-md font-semibold text-slate-700 mb-2">Sources (from Google Search Grounding):</h4>
            <ul className="list-disc list-inside space-y-1">
              {groundingMetadata.groundingChunks.map((chunk, index) =>
                chunk.web && chunk.web.uri ? (
                  <li key={index} className="text-sm">
                    <a
                      href={chunk.web.uri}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-emerald-600 hover:text-emerald-700 hover:underline"
                      title={chunk.web.title || chunk.web.uri}
                    >
                      {chunk.web.title || chunk.web.uri}
                    </a>
                  </li>
                ) : null
              )}
            </ul>
          </div>
        )}
      </div>
      <div className="mt-6 flex justify-center">
        <button
          onClick={handleDownloadPdf}
          disabled={isGeneratingPdf}
          className="flex items-center px-6 py-3 bg-emerald-600 text-white font-semibold rounded-lg shadow-md hover:bg-emerald-700 disabled:bg-gray-400 disabled:text-gray-200 disabled:cursor-not-allowed transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-opacity-50"
          aria-live="polite"
        >
          {isGeneratingPdf ? (
            <>
              <LoadingSpinner small={true} />
              <span className="ml-2">Generating PDF...</span>
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
              </svg>
              Download as PDF
            </>
          )}
        </button>
      </div>
    </div>
  );
};