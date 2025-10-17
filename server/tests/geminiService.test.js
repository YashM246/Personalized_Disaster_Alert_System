/**
 * Unit Tests for Gemini Service
 * Tests API integration and fallback behavior
 */

const { generatePersonalizedAlert } = require('../services/geminiService');

describe('Gemini Service Tests', () => {

  const mockPrompt = `Generate a disaster alert for a wildfire...`;

  test('Should return an object', async () => {
    const result = await generatePersonalizedAlert(mockPrompt);
    expect(typeof result).toBe('object');
    expect(result).toBeDefined();
  });

  test('Result should have required fields', async () => {
    const result = await generatePersonalizedAlert(mockPrompt);

    expect(result).toHaveProperty('primaryLanguage');
    expect(result).toHaveProperty('secondaryLanguages');
    expect(result).toHaveProperty('readingLevel');
    expect(result).toHaveProperty('urgencyLevel');
    expect(result).toHaveProperty('headline');
    expect(result).toHaveProperty('body');
    expect(result).toHaveProperty('actions');
    expect(result).toHaveProperty('specialConsiderations');
    expect(result).toHaveProperty('translations');
  });

  test('Primary language should be a string', async () => {
    const result = await generatePersonalizedAlert(mockPrompt);
    expect(typeof result.primaryLanguage).toBe('string');
    expect(result.primaryLanguage.length).toBeGreaterThan(0);
  });

  test('Secondary languages should be an array', async () => {
    const result = await generatePersonalizedAlert(mockPrompt);
    expect(Array.isArray(result.secondaryLanguages)).toBe(true);
  });

  test('Reading level should be valid', async () => {
    const result = await generatePersonalizedAlert(mockPrompt);
    const validLevels = ['low', 'medium', 'high'];
    expect(validLevels).toContain(result.readingLevel);
  });

  test('Urgency level should be 1-5', async () => {
    const result = await generatePersonalizedAlert(mockPrompt);
    expect(result.urgencyLevel).toBeGreaterThanOrEqual(1);
    expect(result.urgencyLevel).toBeLessThanOrEqual(5);
  });

  test('Headline should be a non-empty string', async () => {
    const result = await generatePersonalizedAlert(mockPrompt);
    expect(typeof result.headline).toBe('string');
    expect(result.headline.length).toBeGreaterThan(0);
  });

  test('Body should be a non-empty string', async () => {
    const result = await generatePersonalizedAlert(mockPrompt);
    expect(typeof result.body).toBe('string');
    expect(result.body.length).toBeGreaterThan(0);
  });

  test('Actions should be an array with at least 3 items', async () => {
    const result = await generatePersonalizedAlert(mockPrompt);
    expect(Array.isArray(result.actions)).toBe(true);
    expect(result.actions.length).toBeGreaterThanOrEqual(3);
  });

  test('All actions should be non-empty strings', async () => {
    const result = await generatePersonalizedAlert(mockPrompt);
    result.actions.forEach(action => {
      expect(typeof action).toBe('string');
      expect(action.length).toBeGreaterThan(0);
    });
  });

  test('Special considerations should be an array', async () => {
    const result = await generatePersonalizedAlert(mockPrompt);
    expect(Array.isArray(result.specialConsiderations)).toBe(true);
    expect(result.specialConsiderations.length).toBeGreaterThan(0);
  });

  test('Translations should be an object', async () => {
    const result = await generatePersonalizedAlert(mockPrompt);
    expect(typeof result.translations).toBe('object');
  });

  test('Translations should have at least one language', async () => {
    const result = await generatePersonalizedAlert(mockPrompt);
    const languages = Object.keys(result.translations);
    expect(languages.length).toBeGreaterThan(0);
  });

  test('Each translation should have headline and body', async () => {
    const result = await generatePersonalizedAlert(mockPrompt);
    Object.values(result.translations).forEach(translation => {
      expect(translation).toHaveProperty('headline');
      expect(translation).toHaveProperty('body');
      expect(typeof translation.headline).toBe('string');
      expect(typeof translation.body).toBe('string');
    });
  });

  test('Should handle empty prompt gracefully', async () => {
    const result = await generatePersonalizedAlert('');
    expect(result).toBeDefined();
    expect(result).toHaveProperty('headline');
  });

  test('Should handle null prompt gracefully', async () => {
    const result = await generatePersonalizedAlert(null);
    expect(result).toBeDefined();
    expect(result).toHaveProperty('headline');
  });

  test('Fallback should work (API may not be configured)', async () => {
    // This test expects the fallback to work since API key may not be set
    const result = await generatePersonalizedAlert(mockPrompt);
    expect(result.primaryLanguage).toBe('English');
    expect(result.translations).toHaveProperty('Spanish');
  });
});
