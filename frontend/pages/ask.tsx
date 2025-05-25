import React, { useState } from 'react';
import axios from 'axios';

export default function Ask() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setIsLoading(true);
    setResult('');

    try {
      const response = await axios.get(`http://localhost:8000/ask?q=${encodeURIComponent(input)}`);
      setResult(response.data.prediction);
    } catch (error) {
      setResult('Error getting prediction. Please try again.');
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900">Ask Your Model</h2>
          <p className="mt-2 text-sm text-gray-600">
            Enter your question to get a prediction from the trained model
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8">
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="question" className="sr-only">
                Your question
              </label>
              <input
                id="question"
                name="question"
                type="text"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Enter your question..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
            </div>
          </div>

          <div className="mt-4">
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </>
              ) : (
                'Get Prediction'
              )}
            </button>
          </div>
        </form>

        {result && (
          <div className="mt-6 p-4 rounded-md bg-blue-50 text-blue-700">
            <h3 className="text-lg font-medium">Prediction:</h3>
            <p className="mt-2 text-sm">{result}</p>
          </div>
        )}
      </div>
    </div>
  );
}
