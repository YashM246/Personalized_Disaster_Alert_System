/**
 * Unit Tests for Prompt Builder
 * Tests prompt construction for Gemini API
 */

const { buildAlertPrompt } = require('../services/promptBuilder');
const { generateRandomDisaster } = require('../data/disasterGenerator');
const zipDatabase = require('../data/zipDatabase');

describe('Prompt Builder Tests', () => {

  const testZipData = zipDatabase['90210'];
  const testDisaster = generateRandomDisaster(testZipData);
  const userContext = {
    zipCode: '90210',
    ...testZipData
  };

  test('Should return a string prompt', () => {
    const prompt = buildAlertPrompt(testDisaster, userContext);
    expect(typeof prompt).toBe('string');
    expect(prompt.length).toBeGreaterThan(100);
  });

  test('Prompt should include disaster information', () => {
    const prompt = buildAlertPrompt(testDisaster, userContext);
    expect(prompt).toContain(testDisaster.type.toUpperCase());
    expect(prompt).toContain(testDisaster.severity.toString());
    expect(prompt).toContain(testDisaster.status.toUpperCase());
  });

  test('Prompt should include ZIP code', () => {
    const prompt = buildAlertPrompt(testDisaster, userContext);
    expect(prompt).toContain('90210');
  });

  test('Prompt should include neighborhood', () => {
    const prompt = buildAlertPrompt(testDisaster, userContext);
    expect(prompt).toContain(testZipData.neighborhood);
  });

  test('Prompt should include language information', () => {
    const prompt = buildAlertPrompt(testDisaster, userContext);
    Object.keys(testZipData.languages).forEach(lang => {
      expect(prompt).toContain(lang);
    });
  });

  test('Prompt should include demographic details', () => {
    const prompt = buildAlertPrompt(testDisaster, userContext);
    expect(prompt).toContain(testZipData.medianAge.toString());
    expect(prompt).toContain(testZipData.medianIncome.toLocaleString());
    expect(prompt).toContain(testZipData.educationLevel);
  });

  test('Prompt should include vulnerable population data', () => {
    const prompt = buildAlertPrompt(testDisaster, userContext);
    expect(prompt).toContain('elderly');
    expect(prompt).toContain('children');
    expect(prompt).toContain('disabled');
  });

  test('Prompt should include all official actions', () => {
    const prompt = buildAlertPrompt(testDisaster, userContext);
    testDisaster.officialActions.forEach(action => {
      expect(prompt).toContain(action);
    });
  });

  test('Prompt should request JSON format', () => {
    const prompt = buildAlertPrompt(testDisaster, userContext);
    expect(prompt.toLowerCase()).toContain('json');
  });

  test('Prompt should specify required fields', () => {
    const prompt = buildAlertPrompt(testDisaster, userContext);
    const requiredFields = [
      'primaryLanguage',
      'secondaryLanguages',
      'readingLevel',
      'urgencyLevel',
      'headline',
      'body',
      'actions',
      'specialConsiderations',
      'translations'
    ];

    requiredFields.forEach(field => {
      expect(prompt).toContain(field);
    });
  });

  test('Prompt should mention reading level adaptation', () => {
    const prompt = buildAlertPrompt(testDisaster, userContext);
    expect(prompt.toLowerCase()).toContain('reading level');
  });

  test('Prompt should mention culturally appropriate', () => {
    const prompt = buildAlertPrompt(testDisaster, userContext);
    expect(prompt.toLowerCase()).toContain('culturally appropriate');
  });

  test('Prompt should work with all ZIP codes', () => {
    Object.entries(zipDatabase).forEach(([zip, data]) => {
      const disaster = generateRandomDisaster(data);
      const context = { zipCode: zip, ...data };
      const prompt = buildAlertPrompt(disaster, context);

      expect(prompt.length).toBeGreaterThan(100);
      expect(prompt).toContain(zip);
      expect(prompt).toContain(data.neighborhood);
    });
  });

  test('Prompt should include distance and impact time', () => {
    const prompt = buildAlertPrompt(testDisaster, userContext);
    expect(prompt).toContain(testDisaster.distance.toString());
    expect(prompt).toContain(testDisaster.impactTime);
  });
});
