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
    { zip: '90024', label: 'Westwood, LA, CA' },
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
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-red-600 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-yellow-400/20 to-transparent rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-blue-400/20 to-transparent rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="max-w-2xl w-full relative z-10">
        <div className="bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl p-8 md:p-12 border border-white/20">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-block mb-6 relative">
              <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-orange-500 rounded-full blur-xl opacity-50 animate-pulse"></div>
              <div className="relative text-7xl animate-bounce">🚨</div>
            </div>
            <h1 className="text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-red-600 via-orange-600 to-yellow-600 bg-clip-text text-transparent mb-4 leading-tight">
              PANDAS
            </h1>
            <div className="h-1 w-32 bg-gradient-to-r from-red-500 to-yellow-500 mx-auto rounded-full mb-6"></div>
            <p className="text-xl text-gray-700 font-semibold">
              Personalized AI Natural Disaster Alert System
            </p>
            <p className="text-sm text-gray-600 mt-3 max-w-md mx-auto">
              Enter your ZIP code to generate a culturally-appropriate disaster alert tailored to your community
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="mb-10">
            <div className="mb-6">
              <label htmlFor="zipCode" className="block text-sm font-bold text-gray-800 mb-3 uppercase tracking-wide">
                📍 Your ZIP Code
              </label>
              <div className="relative">
                <input
                  id="zipCode"
                  type="text"
                  inputMode="numeric"
                  value={zipCode}
                  onChange={handleInputChange}
                  placeholder="Enter 5-digit ZIP code"
                  disabled={loading}
                  className={`w-full px-6 py-4 text-xl font-semibold border-3 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-400/50 transition-all duration-200 shadow-md ${
                    error ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-white'
                  } ${loading ? 'bg-gray-100 cursor-not-allowed opacity-60' : ''}`}
                />
                {zipCode.length === 5 && !error && (
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-green-500 text-2xl">
                    ✓
                  </div>
                )}
              </div>
              {error && (
                <div className="mt-3 p-3 bg-red-50 border-l-4 border-red-500 rounded-r-lg">
                  <p className="text-sm text-red-700 flex items-center gap-2 font-medium">
                    <span className="text-lg">⚠️</span>
                    {error}
                  </p>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={loading || zipCode.length !== 5}
              className="w-full bg-gradient-to-r from-red-600 via-orange-600 to-yellow-600 hover:from-red-700 hover:via-orange-700 hover:to-yellow-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed text-white font-bold py-5 px-8 rounded-xl transition-all duration-300 flex items-center justify-center gap-3 text-lg shadow-lg hover:shadow-2xl hover:scale-105 transform"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Generating Alert...</span>
                </>
              ) : (
                <>
                  <span className="text-2xl">⚡</span>
                  <span>Generate Emergency Alert</span>
                </>
              )}
            </button>
          </form>

          {/* Quick Select */}
          <div>
            <div className="text-center mb-6">
              <p className="text-sm font-bold text-gray-800 mb-2 uppercase tracking-wide">
                ⚡ Quick Select
              </p>
              <p className="text-xs text-gray-600">
                Try one of these sample locations:
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
              {sampleZips.map((sample) => (
                <button
                  key={sample.zip}
                  onClick={() => handleQuickSelect(sample.zip)}
                  disabled={loading}
                  className="group relative px-4 py-3 bg-gradient-to-br from-blue-50 to-purple-50 hover:from-blue-100 hover:to-purple-100 border-2 border-blue-200 hover:border-blue-400 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-left shadow-sm hover:shadow-md transform hover:-translate-y-1"
                >
                  <div className="font-bold text-blue-900 text-sm mb-1">{sample.zip}</div>
                  <div className="text-xs text-gray-700 leading-tight">{sample.label}</div>
                  <div className="absolute top-1 right-1 text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                    📍
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Info Section */}
          <div className="mt-10 pt-8 border-t-2 border-gray-200">
            <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-2xl p-6 border-2 border-blue-200 shadow-inner">
              <div className="flex items-start gap-4">
                <div className="text-3xl mt-1 flex-shrink-0">🤖</div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-2 text-lg">
                    AI-Powered Demo System
                  </h3>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    This system uses <span className="font-semibold text-blue-700">Gemini AI</span> to generate
                    personalized disaster alerts based on community demographics, language preferences, and vulnerability factors.
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-white rounded-full text-xs font-medium text-gray-700 shadow-sm">
                      🌍 Cultural Context
                    </span>
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-white rounded-full text-xs font-medium text-gray-700 shadow-sm">
                      🗣️ Language Support
                    </span>
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-white rounded-full text-xs font-medium text-gray-700 shadow-sm">
                      🎯 Community-Specific
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ZipCodeInput;
