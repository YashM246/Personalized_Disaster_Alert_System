import { useState } from 'react';

/**
 * ZipCodeInput Component
 * Allows users to enter a ZIP code or select from sample locations
 */
function ZipCodeInput({ onSubmit, loading }) {
  const [zipCode, setZipCode] = useState('');
  const [error, setError] = useState('');

  // Sample ZIP codes for quick selection
  const sampleZips = [
    { zip: '90210', label: 'Beverly Hills, CA' },
    { zip: '90022', label: 'East LA, CA' },
    { zip: '94102', label: 'San Francisco, CA' },
    { zip: '33139', label: 'Miami Beach, FL' },
    { zip: '90802', label: 'Long Beach, CA' },
    { zip: '97201', label: 'Portland, OR' },
    { zip: '70112', label: 'New Orleans, LA' },
    { zip: '80202', label: 'Denver, CO' },
    { zip: '99501', label: 'Anchorage, AK' },
    { zip: '10001', label: 'Manhattan, NY' }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate ZIP code
    if (!/^\d{5}$/.test(zipCode)) {
      setError('Please enter a valid 5-digit ZIP code');
      return;
    }

    setError('');
    onSubmit(zipCode);
  };

  const handleQuickSelect = (zip) => {
    setZipCode(zip);
    setError('');
  };

  const handleInputChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 5);
    setZipCode(value);
    if (error) setError('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-red-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              🚨 Disaster Alert System
            </h1>
            <p className="text-lg text-gray-600">
              AI-Powered Personalized Emergency Alerts
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Enter your ZIP code to generate a culturally-appropriate disaster alert
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="mb-8">
            <div className="mb-4">
              <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700 mb-2">
                ZIP Code
              </label>
              <input
                id="zipCode"
                type="text"
                inputMode="numeric"
                value={zipCode}
                onChange={handleInputChange}
                placeholder="Enter 5-digit ZIP code"
                disabled={loading}
                className={`w-full px-4 py-3 text-lg border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
                  error ? 'border-red-500' : 'border-gray-300'
                } ${loading ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}`}
              />
              {error && (
                <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                  <span>⚠️</span>
                  {error}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading || zipCode.length !== 5}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-4 px-6 rounded-lg transition duration-200 flex items-center justify-center gap-2 text-lg"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Generating Alert...</span>
                </>
              ) : (
                <>
                  <span>⚡</span>
                  <span>Generate Emergency Alert</span>
                </>
              )}
            </button>
          </form>

          {/* Quick Select */}
          <div>
            <p className="text-sm font-medium text-gray-700 mb-3 text-center">
              Or try one of these locations:
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {sampleZips.map((sample) => (
                <button
                  key={sample.zip}
                  onClick={() => handleQuickSelect(sample.zip)}
                  disabled={loading}
                  className="px-3 py-2 text-sm border-2 border-gray-300 hover:border-blue-500 hover:bg-blue-50 rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-left"
                >
                  <div className="font-semibold text-gray-900">{sample.zip}</div>
                  <div className="text-xs text-gray-600">{sample.label}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Info Section */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="bg-blue-50 rounded-lg p-4">
              <p className="text-sm text-gray-700">
                <span className="font-semibold">ℹ️ Demo System:</span> This system uses Claude AI to generate
                personalized disaster alerts based on community demographics, language preferences, and vulnerability factors.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ZipCodeInput;
