/**
 * Gemini API Service
 * Handles communication with Google's Gemini API for generating personalized alerts
 */

const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize Gemini client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Generates a personalized alert using Gemini API
 * @param {string} prompt - The complete prompt with disaster and demographic context
 * @returns {Promise<Object>} Parsed alert data from Gemini
 */
async function generatePersonalizedAlert(prompt) {
  try {
    console.log('Calling Gemini API...');

    // Use Gemini 1.5 Flash (free tier)
    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 2048,
      }
    });

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let responseText = response.text();

    console.log('Received response from Gemini API');

    // Remove markdown code blocks if present
    responseText = responseText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

    // Parse JSON response
    const alertData = JSON.parse(responseText);

    return alertData;

  } catch (error) {
    console.error('Error calling Gemini API:', error.message);

    // Return fallback response if API fails
    return getFallbackResponse();
  }
}

/**
 * Provides a fallback response when Gemini API is unavailable
 * @returns {Object} Generic alert structure
 */
function getFallbackResponse() {
  return {
    primaryLanguage: "English",
    secondaryLanguages: ["Spanish"],
    readingLevel: "medium",
    urgencyLevel: 4,
    headline: "⚠️ Emergency Alert - Take Action Now",
    body: "A natural disaster is affecting your area. Follow official guidance from local authorities. Evacuate if ordered. Stay informed through emergency broadcasts. Ensure you have emergency supplies ready including water, food, and medications.",
    actions: [
      "Monitor local news and emergency alerts",
      "Prepare or grab your emergency kit",
      "Follow evacuation orders immediately if issued",
      "Stay away from windows and hazardous areas",
      "Keep phone charged and limit non-emergency calls"
    ],
    specialConsiderations: [
      "If you have mobility limitations, arrange transportation assistance now",
      "Families with children should pack comfort items and maintain calm",
      "Individuals with medical needs should secure medication and medical equipment"
    ],
    translations: {
      "Spanish": {
        "headline": "⚠️ Alerta de Emergencia - Actúe Ahora",
        "body": "Un desastre natural está afectando su área. Siga la guía oficial de las autoridades locales. Evacúe si se le ordena. Manténgase informado a través de transmisiones de emergencia. Asegúrese de tener suministros de emergencia listos incluyendo agua, comida y medicamentos."
      }
    }
  };
}

module.exports = { generatePersonalizedAlert };
