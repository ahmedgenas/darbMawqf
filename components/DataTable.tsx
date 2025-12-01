import React from 'react';
import { FineRecord } from '../types';

interface DataTableProps {
  data: FineRecord[];
  onDownload: () => void;
  onReset: () => void;
}

const DataTable: React.FC<DataTableProps> = ({ data, onDownload, onReset }) => {
  if (data.length === 0) return null;

  return (
    <div className="w-full mt-8 animate-fade-in">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800">Extracted Data ({data.length} records)</h2>
        <div className="space-x-3">
            <button
            onClick={onReset}
            className="px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
            Upload New File
            </button>
            <button
            onClick={onDownload}
            className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors shadow-sm flex items-center gap-2"
            >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Download Excel/CSV
            </button>
        </div>
      </div>

      <div className="overflow-x-auto bg-white rounded-lg shadow border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Traffic No</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">English Name</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fine Number</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Plate</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider font-arabic">نوع المخالفة (AR)</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fine Type (EN)</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((row, idx) => (
              <tr key={idx} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">{row.trafficNumber}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{row.englishName}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{row.fineNumber}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 bg-yellow-50 font-mono rounded-md mx-2">{row.plateNumber}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.fineDate}</td>
                <td className="px-6 py-4 text-sm text-gray-800 text-right font-arabic min-w-[200px]" dir="rtl">{row.fineType}</td>
                <td className="px-6 py-4 text-sm text-gray-600 min-w-[200px]">{row.fineTypeEn}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">{row.fineAmount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DataTable;