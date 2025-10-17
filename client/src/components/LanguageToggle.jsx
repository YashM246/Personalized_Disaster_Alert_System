/**
 * LanguageToggle Component
 * Allows users to switch between available language translations
 */
function LanguageToggle({ languages, selectedLanguage, onChange }) {
  // Map language names to flag emojis
  const languageFlags = {
    English: '🇺🇸',
    Spanish: '🇪🇸',
    Persian: '🇮🇷',
    Hebrew: '🇮🇱',
    Chinese: '🇨🇳',
    Vietnamese: '🇻🇳',
    Tagalog: '🇵🇭',
    Portuguese: '🇵🇹',
    Haitian: '🇭🇹',
    French: '🇫🇷',
    Khmer: '🇰🇭',
    Korean: '🇰🇷',
    Russian: '🇷🇺',
    Indigenous: '🪶',
    Samoan: '🇼🇸'
  };

  return (
    <div className="mb-6">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        🌐 Language / Idioma
      </label>
      <div className="flex flex-wrap gap-2">
        {languages.map((language) => {
          const isSelected = selectedLanguage === language;
          const flag = languageFlags[language] || '🌍';

          return (
            <button
              key={language}
              onClick={() => onChange(language)}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 ${
                isSelected
                  ? 'bg-blue-600 text-white shadow-lg scale-105'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300 hover:scale-102'
              }`}
            >
              <span className="text-lg">{flag}</span>
              <span>{language}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default LanguageToggle;
