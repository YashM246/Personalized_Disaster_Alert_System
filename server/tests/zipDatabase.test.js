/**
 * Unit Tests for ZIP Database
 * Tests the structure and content of demographic data
 */

const zipDatabase = require('../data/zipDatabase');

describe('ZIP Database Tests', () => {

  test('Database should contain exactly 10 ZIP codes', () => {
    const zipCodes = Object.keys(zipDatabase);
    expect(zipCodes).toHaveLength(10);
  });

  test('All ZIP codes should be 5-digit strings', () => {
    const zipCodes = Object.keys(zipDatabase);
    zipCodes.forEach(zip => {
      expect(zip).toMatch(/^\d{5}$/);
    });
  });

  test('Each ZIP should have required demographic fields', () => {
    const requiredFields = [
      'neighborhood',
      'languages',
      'medianAge',
      'medianIncome',
      'educationLevel',
      'geography',
      'coordinates',
      'vulnerablePopulations',
      'historicalRisks'
    ];

    Object.entries(zipDatabase).forEach(([zip, data]) => {
      requiredFields.forEach(field => {
        expect(data).toHaveProperty(field);
      });
    });
  });

  test('Languages should sum to approximately 100%', () => {
    Object.entries(zipDatabase).forEach(([zip, data]) => {
      const total = Object.values(data.languages).reduce((sum, val) => sum + val, 0);
      expect(total).toBeGreaterThan(95);
      expect(total).toBeLessThan(105);
    });
  });

  test('Vulnerable populations should be valid percentages', () => {
    Object.entries(zipDatabase).forEach(([zip, data]) => {
      const { elderly, children, disabled } = data.vulnerablePopulations;
      expect(elderly).toBeGreaterThanOrEqual(0);
      expect(elderly).toBeLessThan(100);
      expect(children).toBeGreaterThanOrEqual(0);
      expect(children).toBeLessThan(100);
      expect(disabled).toBeGreaterThanOrEqual(0);
      expect(disabled).toBeLessThan(100);
    });
  });

  test('Coordinates should be valid latitude and longitude', () => {
    Object.entries(zipDatabase).forEach(([zip, data]) => {
      const { lat, lng } = data.coordinates;
      expect(lat).toBeGreaterThanOrEqual(-90);
      expect(lat).toBeLessThanOrEqual(90);
      expect(lng).toBeGreaterThanOrEqual(-180);
      expect(lng).toBeLessThanOrEqual(180);
    });
  });

  test('Historical risks should be non-empty arrays', () => {
    Object.entries(zipDatabase).forEach(([zip, data]) => {
      expect(Array.isArray(data.historicalRisks)).toBe(true);
      expect(data.historicalRisks.length).toBeGreaterThan(0);
    });
  });

  test('Education level should be valid', () => {
    const validLevels = ['low', 'medium', 'high'];
    Object.entries(zipDatabase).forEach(([zip, data]) => {
      expect(validLevels).toContain(data.educationLevel);
    });
  });

  test('Specific ZIP codes should exist', () => {
    const expectedZips = ['90210', '90022', '94102', '33139', '90802',
                          '97201', '70112', '80202', '99501', '10001'];
    expectedZips.forEach(zip => {
      expect(zipDatabase).toHaveProperty(zip);
    });
  });

  test('ZIP 90022 should have high Spanish percentage', () => {
    expect(zipDatabase['90022'].languages.Spanish).toBeGreaterThan(70);
  });

  test('ZIP 90210 should have high income', () => {
    expect(zipDatabase['90210'].medianIncome).toBeGreaterThan(80000);
  });
});
