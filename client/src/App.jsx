import { useState } from 'react';
import axios from 'axios';
import ZipCodeInput from './components/ZipCodeInput';
import AlertPopup from './components/AlertPopup';

/**
 * Main App Component
 * Manages the application state and API communication
 */
function App() {
  const [alertData, setAlertData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const API_BASE_URL = 'http://localhost:3001/api';

  /**
   * Handles ZIP code submission and alert generation
   */
  const handleGenerateAlert = async (zipCode) => {
    setLoading(true);
    setError('');

    try {
      console.log(`Requesting alert for ZIP code: ${zipCode}`);

      const response = await axios.post(`${API_BASE_URL}/generate-alert`, {
        zipCode: zipCode
      });

      console.log('Alert generated successfully');
      setAlertData(response.data);

    } catch (err) {
      console.error('Error generating alert:', err);

      if (err.response) {
        // Server responded with error
        const errorMessage = err.response.data.message || 'Failed to generate alert';
        const availableZips = err.response.data.availableZipCodes;

        if (availableZips) {
          setError(`${errorMessage}. Available ZIP codes: ${availableZips.join(', ')}`);
        } else {
          setError(errorMessage);
        }
      } else if (err.request) {
        // Request made but no response
        setError('Unable to connect to server. Please ensure the backend is running on http://localhost:3001');
      } else {
        // Something else happened
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handles closing the alert popup
   */
  const handleCloseAlert = () => {
    setAlertData(null);
  };

  return (
    <div className="App">
      {/* Error Banner */}
      {error && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-red-600 text-white px-4 py-3 shadow-lg">
          <div className="max-w-4xl mx-auto flex items-start justify-between gap-4">
            <div className="flex items-start gap-2">
              <span className="text-xl">⚠️</span>
              <div>
                <p className="font-semibold">Error</p>
                <p className="text-sm">{error}</p>
              </div>
            </div>
            <button
              onClick={() => setError('')}
              className="text-white hover:text-gray-200 text-xl font-bold"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Main Content */}
      {!alertData ? (
        <ZipCodeInput onSubmit={handleGenerateAlert} loading={loading} />
      ) : (
        <AlertPopup alertData={alertData} onClose={handleCloseAlert} />
      )}
    </div>
  );
}

export default App;
