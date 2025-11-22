import React, { useState } from 'react';
import { FineRecord, ProcessingStatus } from './types';
import { extractDataFromPdf } from './services/geminiService';
import UploadArea from './components/UploadArea';
import DataTable from './components/DataTable';

const App: React.FC = () => {
  const [status, setStatus] = useState<ProcessingStatus>(ProcessingStatus.IDLE);
  const [data, setData] = useState<FineRecord[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleFileSelect = async (file: File) => {
    setStatus(ProcessingStatus.PROCESSING);
    setErrorMessage(null);

    try {
      // Convert file to Base64
      const reader = new FileReader();
      reader.readAsDataURL(file);
      
      reader.onload = async () => {
        const base64String = reader.result as string;
        // Remove the data URL prefix (e.g., "data:application/pdf;base64,")
        const base64Content = base64String.split(',')[1];
        
        try {
          const extractedData = await extractDataFromPdf(base64Content, file.type);
          setData(extractedData);
          setStatus(ProcessingStatus.SUCCESS);
        } catch (error) {
          console.error(error);
          setErrorMessage("Failed to extract data. Please ensure the PDF is readable.");
          setStatus(ProcessingStatus.ERROR);
        }
      };

      reader.onerror = () => {
        setErrorMessage("Error reading file.");
        setStatus(ProcessingStatus.ERROR);
      };

    } catch (e) {
      setErrorMessage("Unexpected error occurred.");
      setStatus(ProcessingStatus.ERROR);
    }
  };

  const downloadCSV = () => {
    if (data.length === 0) return;

    // Add BOM for Excel to recognize UTF-8 (crucial for Arabic)
    const BOM = "\uFEFF";
    const headers = ["Fine Number", "Plate Number", "Fine Date", "Fine Type (AR)", "Fine Type (EN)", "Fine Amount", "Reference No"];
    
    const csvContent = [
      headers.join(","),
      ...data.map(row => {
        // Escape quotes in fields
        const safeTypeAr = `"${(row.fineType || '').replace(/"/g, '""')}"`; 
        const safeTypeEn = `"${(row.fineTypeEn || '').replace(/"/g, '""')}"`; 
        return [
            row.fineNumber, 
            row.plateNumber, 
            row.fineDate, 
            safeTypeAr, 
            safeTypeEn,
            row.fineAmount, 
            row.referenceNo
        ].join(",");
      })
    ].join("\n");

    const blob = new Blob([BOM + csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "fines_output.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const reset = () => {
      setData([]);
      setStatus(ProcessingStatus.IDLE);
      setErrorMessage(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl w-full space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl mb-2">
            Smart PDF Extractor
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Upload your parking fine PDFs. Our AI handles Arabic text, table layouts, and irregular formatting better than traditional scripts.
          </p>
        </div>

        {/* Upload Section */}
        {data.length === 0 && (
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            <UploadArea onFileSelect={handleFileSelect} status={status} />
            {status === ProcessingStatus.ERROR && (
                <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-lg border border-red-200 flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/></svg>
                    {errorMessage}
                </div>
            )}
          </div>
        )}

        {/* Results Section */}
        {status === ProcessingStatus.SUCCESS && (
            <DataTable 
                data={data} 
                onDownload={downloadCSV} 
                onReset={reset}
            />
        )}
      </div>
    </div>
  );
};

export default App;