import { useState } from 'react';
import ActionChecklist from './ActionChecklist';
import LanguageToggle from './LanguageToggle';

/**
 * AlertPopup Component
 * Displays the personalized disaster alert in a modal overlay
 */
function AlertPopup({ alertData, onClose }) {
  const [selectedLanguage, setSelectedLanguage] = useState('English');
  const [checkedActions, setCheckedActions] = useState([]);

  if (!alertData) return null;

  const { disaster, alert, location } = alertData;

  // Severity color mapping
  const severityColors = {
    1: { bg: 'bg-blue-100', border: 'border-blue-500', text: 'text-blue-800', badge: 'bg-blue-500' },
    2: { bg: 'bg-green-100', border: 'border-green-500', text: 'text-green-800', badge: 'bg-green-500' },
    3: { bg: 'bg-moderate', border: 'border-yellow-500', text: 'text-yellow-900', badge: 'bg-moderate' },
    4: { bg: 'bg-high', border: 'border-orange-600', text: 'text-orange-900', badge: 'bg-high' },
    5: { bg: 'bg-critical', border: 'border-red-700', text: 'text-red-900', badge: 'bg-critical' }
  };

  const colors = severityColors[disaster.severity] || severityColors[3];

  // Disaster type emojis
  const disasterEmojis = {
    wildfire: '🔥',
    flood: '🌊',
    tsunami: '🌊',
    earthquake: '🏚️',
    hurricane: '🌀'
  };

  const disasterEmoji = disasterEmojis[disaster.type] || '⚠️';

  // Get current language content
  const getCurrentContent = () => {
    if (selectedLanguage === 'English' || !alert.translations[selectedLanguage]) {
      return {
        headline: alert.headline,
        body: alert.body
      };
    }
    return alert.translations[selectedLanguage];
  };

  const currentContent = getCurrentContent();

  // Available languages (English + translations)
  const availableLanguages = ['English', ...Object.keys(alert.translations || {})];

  // Handle action checkbox toggle
  const handleActionToggle = (index) => {
    setCheckedActions(prev =>
      prev.includes(index)
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  // Format timestamp
  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fadeIn">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header with Severity Banner */}
        <div className={`${colors.bg} ${colors.border} border-b-4 p-6 rounded-t-2xl`}>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <span className="text-4xl">{disasterEmoji}</span>
              <div>
                <h2 className={`text-2xl font-bold ${colors.text} capitalize`}>
                  {disaster.type} {disaster.status}
                </h2>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`${colors.badge} text-white text-xs font-bold px-3 py-1 rounded-full`}>
                    SEVERITY {disaster.severity}/5
                  </span>
                  <span className="text-sm text-gray-700">
                    {disaster.distance} miles away
                  </span>
                </div>
              </div>
            </div>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="text-gray-600 hover:text-gray-900 text-2xl font-bold leading-none p-2 hover:bg-white hover:bg-opacity-50 rounded-lg transition"
              aria-label="Close"
            >
              ×
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 md:p-8">
          {/* Location Info */}
          <div className="mb-4 text-sm text-gray-600">
            <span className="font-semibold">📍 Location:</span> {location.neighborhood} ({location.zipCode})
          </div>

          {/* Impact Time */}
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded">
            <p className="text-sm font-semibold text-red-900">
              ⏱️ Expected Impact: <span className="text-red-700">{disaster.impactTime}</span>
            </p>
          </div>

          {/* Language Toggle */}
          {availableLanguages.length > 1 && (
            <LanguageToggle
              languages={availableLanguages}
              selectedLanguage={selectedLanguage}
              onChange={setSelectedLanguage}
            />
          )}

          {/* Headline */}
          <div className="mb-4">
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight">
              {currentContent.headline}
            </h3>
          </div>

          {/* Body Message */}
          <div className="mb-6">
            <p className="text-lg text-gray-700 leading-relaxed">
              {currentContent.body}
            </p>
          </div>

          {/* Action Checklist */}
          {alert.actions && alert.actions.length > 0 && (
            <ActionChecklist
              actions={alert.actions}
              checkedActions={checkedActions}
              onToggle={handleActionToggle}
            />
          )}

          {/* Special Considerations */}
          {alert.specialConsiderations && alert.specialConsiderations.length > 0 && (
            <div className="mt-6 p-5 bg-purple-50 border-2 border-purple-300 rounded-lg">
              <h4 className="text-lg font-semibold text-purple-900 mb-3 flex items-center gap-2">
                <span>👥</span>
                <span>Special Considerations</span>
              </h4>
              <div className="space-y-3">
                {alert.specialConsiderations.map((consideration, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                      {index + 1}
                    </div>
                    <p className="text-sm text-purple-900 leading-relaxed">
                      {consideration}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="text-xs text-gray-600">
                <p>
                  <span className="font-semibold">Alert Generated:</span> {formatTime(disaster.timestamp)}
                </p>
                <p className="mt-1">
                  <span className="font-semibold">Source:</span> AI-Powered Emergency Alert System
                </p>
              </div>
              <button
                onClick={onClose}
                className="w-full md:w-auto px-6 py-3 bg-gray-800 hover:bg-gray-900 text-white font-semibold rounded-lg transition"
              >
                Close Alert
              </button>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}

export default AlertPopup;
