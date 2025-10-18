/**
 * Alert API Routes
 * Handles emergency alert generation requests
 */

const express = require('express');
const router = express.Router();
const zipDatabase = require('../data/zipDatabase');
const { generateRandomDisaster } = require('../data/disasterGenerator');
const { buildAlertPrompt } = require('../services/promptBuilder');
const { generatePersonalizedAlert } = require('../services/geminiService');

/**
 * POST /api/generate-alert
 * Generates a personalized disaster alert for a given ZIP code
 */
router.post('/generate-alert', async (req, res) => {
  try {
    const { zipCode } = req.body;

    // Validate ZIP code format
    if (!zipCode || !/^\d{5}$/.test(zipCode)) {
      return res.status(400).json({
        error: 'Invalid ZIP code format',
        message: 'ZIP code must be exactly 5 digits'
      });
    }

    // Check if ZIP exists in database
    if (!zipDatabase[zipCode]) {
      const availableZips = Object.keys(zipDatabase).sort();
      return res.status(404).json({
        error: 'ZIP code not found',
        message: 'This ZIP code is not in our demo database',
        availableZipCodes: availableZips
      });
    }

    // Get ZIP data
    const zipData = zipDatabase[zipCode];

    // Generate random disaster scenario
    console.log(`Generating disaster scenario for ZIP ${zipCode}...`);
    const disaster = generateRandomDisaster(zipData);
    console.log(`Generated ${disaster.type} (severity ${disaster.severity})`);

    // Build user context
    const userContext = {
      zipCode,
      ...zipData
    };

    // Build prompt for Gemini
    const prompt = buildAlertPrompt(disaster, userContext);

    // Generate personalized alert using Gemini API
    const alert = await generatePersonalizedAlert(prompt);

    // Hardcode languages for specific ZIP codes to ensure correct translations
    if (zipCode === '90024') {
      // Westwood Persian neighborhood - show Persian ONLY
      alert.secondaryLanguages = ['Persian'];
      // Keep only Persian translation, remove all others
      const persianTranslation = alert.translations?.Persian || {
        headline: alert.headline,
        body: alert.body
      };
      alert.translations = {
        Persian: persianTranslation
      };
    } else if (zipCode === '90022') {
      // East Los Angeles - show Spanish ONLY
      alert.secondaryLanguages = ['Spanish'];
      // Keep only Spanish translation, remove all others (including Persian)
      const spanishTranslation = alert.translations?.Spanish || {
        headline: alert.headline,
        body: alert.body
      };
      alert.translations = {
        Spanish: spanishTranslation
      };
    }

    // Combine all data for response
    const response = {
      disaster: {
        type: disaster.type,
        severity: disaster.severity,
        status: disaster.status,
        distance: disaster.distance,
        impactTime: disaster.impactTime,
        timestamp: disaster.timestamp
      },
      alert: alert,
      location: {
        zipCode: zipCode,
        neighborhood: zipData.neighborhood
      }
    };

    console.log(`Successfully generated alert for ZIP ${zipCode}`);
    res.json(response);

  } catch (error) {
    console.error('Error generating alert:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to generate alert. Please try again.'
    });
  }
});

/**
 * GET /api/health
 * Health check endpoint
 */
router.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'Natural Disaster Alert System API'
  });
});

module.exports = router;
