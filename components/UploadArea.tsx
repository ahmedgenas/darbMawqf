import React, { useCallback } from 'react';
import { ProcessingStatus } from '../types';

interface UploadAreaProps {
  onFileSelect: (file: File) => void;
  status: ProcessingStatus;
}

const UploadArea: React.FC<UploadAreaProps> = ({ onFileSelect, status }) => {
  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      if (status === ProcessingStatus.PROCESSING) return;
      
      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        const file = e.dataTransfer.files[0];
        if (file.type === 'application/pdf') {
          onFileSelect(file);
        } else {
          alert('Please upload a valid PDF file.');
        }
      }
    },
    [onFileSelect, status]
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onFileSelect(e.target.files[0]);
    }
  };

  const isProcessing = status === ProcessingStatus.PROCESSING;

  return (
    <div
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
      className={`border-2 border-dashed rounded-xl p-10 text-center transition-all duration-200 
        ${isProcessing ? 'border-blue-300 bg-blue-50 cursor-wait' : 'border-gray-300 hover:border-indigo-500 hover:bg-indigo-50 cursor-pointer'}
      `}
    >
      <input
        type="file"
        accept="application/pdf"
        onChange={handleChange}
        className="hidden"
        id="file-upload"
        disabled={isProcessing}
      />
      <label htmlFor="file-upload" className="flex flex-col items-center justify-center h-full cursor-pointer w-full">
        <div className={`p-4 rounded-full mb-4 transition-colors ${isProcessing ? 'bg-blue-100' : 'bg-indigo-100'}`}>
          <svg className={`w-8 h-8 ${isProcessing ? 'text-blue-600' : 'text-indigo-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
        </div>
        
        {isProcessing ? (
          <div className="w-full flex flex-col items-center">
            <p className="text-lg font-semibold text-indigo-700">Analyzing PDF with Gemini AI...</p>
            <p className="text-sm text-indigo-500 mt-2 mb-6">Reading Arabic text and extracting rows</p>
            
            {/* Indeterminate Progress Bar */}
            <div className="w-64 h-2 bg-indigo-200 rounded-full overflow-hidden relative shadow-inner">
               <div className="absolute top-0 left-0 h-full w-full bg-indigo-600 rounded-full animate-loading-bar"></div>
            </div>
            
            <style>{`
              @keyframes loading-bar {
                0% { transform: translateX(-100%); }
                50% { transform: translateX(0%); }
                100% { transform: translateX(100%); }
              }
              .animate-loading-bar {
                animation: loading-bar 1.5s infinite linear;
              }
            `}</style>
          </div>
        ) : (
          <div>
            <p className="text-lg font-medium text-gray-700">Click to upload or drag & drop</p>
            <p className="text-sm text-gray-500 mt-1">PDF files only (e.g. mpqf darp)</p>
          </div>
        )}
      </label>
    </div>
  );
};

export default UploadArea;