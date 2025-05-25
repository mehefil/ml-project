import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';

export default function Learn() {
  const [message, setMessage] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [errorDetails, setErrorDetails] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const onDrop = async (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setIsUploading(true);
      setMessage('');
      setErrorDetails('');
      setSelectedFile(acceptedFiles[0]);

      const formData = new FormData();
      formData.append('file', acceptedFiles[0], acceptedFiles[0].name);

      try {
        const response = await axios.post('http://localhost:8000/learn', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        setMessage('Model trained successfully!');
      } catch (error) {
        if (axios.isAxiosError(error)) {
          setErrorDetails(error.response?.data?.detail || 'Unknown error occurred');
        } else {
          setErrorDetails('Network error. Please check if the backend server is running.');
        }
        setMessage('Error training model. Please try again.');
        console.error('Error:', error);
      } finally {
        setIsUploading(false);
      }
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
    },
    maxSize: 10000000, // 10MB limit
    multiple: false,
  });

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900">Train Your Model</h2>
          <p className="mt-2 text-sm text-gray-600">
            Upload your CSV file to train the machine learning model
          </p>
        </div>

        <div className="mt-8">
          <div className="flex flex-col space-y-4">
            <div
              {...getRootProps()}
              className={`flex items-center justify-center p-6 border-2 border-dashed rounded-lg cursor-pointer transition-all ${
                isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-white'
              }`}
            >
              <input {...getInputProps()} />
              <div className="text-center">
                <div className="flex flex-col items-center">
                  <svg
                    className="w-12 h-12 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                    />
                  </svg>
                  <p className="mt-2 text-sm text-gray-600">
                    {isDragActive ? 'Drop the file here...' : 'Drag & drop your CSV file here'}
                  </p>
                  <p className="mt-1 text-xs text-gray-500">or click to select</p>
                </div>
              </div>
            </div>

            {selectedFile && (
              <div className="bg-white p-4 rounded-lg shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900">Selected File:</h3>
                    <p className="text-sm text-gray-500">{selectedFile.name}</p>
                    <p className="text-xs text-gray-400">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                  <button
                    onClick={() => setSelectedFile(null)}
                    className="text-red-500 hover:text-red-600"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            )}
          </div>

          <button
            onClick={() => {
              const input = document.querySelector('input[type="file"]');
              if (input) {
                (input as HTMLInputElement).click();
              }
            }}
            className="w-full flex items-center justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            {isUploading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Uploading...</span>
              </>
            ) : (
              'Choose File'
            )}
          </button>
        </div>

        {message && (
          <div className="mt-4 p-4 rounded-md bg-green-50 text-green-700">
            {message}
          </div>
        )}

        {errorDetails && (
          <div className="mt-4 p-4 rounded-md bg-red-50 text-red-700">
            <p className="font-medium">Error Details:</p>
            <p className="mt-2 text-sm">{errorDetails}</p>
          </div>
        )}
      </div>
    </div>
  );
}
