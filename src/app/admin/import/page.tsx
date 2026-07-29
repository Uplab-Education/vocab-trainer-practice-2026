"use client";

import { useState } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/ui/page-header";

type ParsedRow = {
  englishWord: string;
  ukrainianTranslation: string;
};

export default function ImportPreviewPage() {
  const [rows, setRows] = useState<ParsedRow[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setError(null);
    setRows([]);

    /*Read the file as text and parse it into structured data*/
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      parseCSV(text);
    };
    reader.onerror = () => {
      setError("Failed to read the file.");
    };
    reader.readAsText(file);
  };

  const parseCSV = (text: string) => {
    /*Split the text into lines and filter out empty ones*/
    const lines = text.split('\n').map((line) => line.trim()).filter((line) => line);
    
    if (lines.length < 2) {
      setError("The CSV file is empty or missing data rows.");
      return;
    }

    /*Get headers and find indices for required columns(ignoring the register)*/
    const headers = lines[0].split(',').map((h) => h.trim().toLowerCase());
    const englishIdx = headers.findIndex((h) => h.includes('english'));
    const ukrainianIdx = headers.findIndex((h) => h.includes('ukrainian'));

    if (englishIdx === -1 || ukrainianIdx === -1) {
      setError("Invalid file structure. Required columns 'English Word' and 'Ukrainian Translation' are missing.");
      return;
    }

    /*Parse valid rows into structured data*/
    const parsedData: ParsedRow[] = [];
    for (let i = 1; i < lines.length; i++) {
      /*Simple CSV parsing (doesn't handle quoted commas)*/
      const columns = lines[i].split(',').map((col) => col.trim());
      
      if (columns.length > Math.max(englishIdx, ukrainianIdx)) {
        parsedData.push({
          englishWord: columns[englishIdx],
          ukrainianTranslation: columns[ukrainianIdx],
        });
      }
    }
    
    setRows(parsedData);
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <Link href="/admin" className="mb-6 inline-block text-sm font-medium text-blue-600 hover:underline">
        &larr; Back to Admin Dashboard
      </Link>
      
      <PageHeader
        eyebrow="Admin"
        title="Import Word Set"
        description="Upload a CSV file to preview words before importing them into a set."
      />

      <div className="mt-8 rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <label className="block text-sm font-medium text-slate-900 mb-2">
          Select CSV File
        </label>
        <input
          type="file"
          accept=".csv"
          onChange={handleFileUpload}
          className="block w-full text-sm text-slate-500 file:mr-4 file:rounded-md file:border-0 file:bg-slate-900 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-slate-800"
        />
        
        {fileName && (
          <p className="mt-2 text-xs text-slate-500">Selected file: {fileName}</p>
        )}
      </div>

      {/*Validation Errors*/}
      {error && (
        <div className="mt-6 rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <strong>Error:</strong> {error}
        </div>
      )}

      {/*Preview Table*/}
      {rows.length > 0 && (
        <div className="mt-8">
          <h3 className="mb-4 text-lg font-semibold text-slate-900">Preview Data ({rows.length} words)</h3>
          <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white shadow-sm">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">English Word</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Ukrainian Translation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {rows.map((row, index) => (
                  <tr key={index} className="hover:bg-slate-50">
                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-slate-900">{row.englishWord}</td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-600">{row.ukrainianTranslation}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="mt-6 flex justify-end">
             <button
                className="rounded-md bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500"
                onClick={() => alert("Import function will be connected to the database in a future PR.")}
             >
                Confirm Import (Local)
             </button>
          </div>
        </div>
      )}
    </div>
  );
}