/**
 * Unit Tests for Disaster Generator
 * Tests disaster scenario generation logic
 */

const { generateRandomDisaster } = require('../data/disasterGenerator');
const zipDatabase = require('../data/zipDatabase');

describe('Disaster Generator Tests', () => {

  const testZipData = zipDatabase['90210'];

  test('Should generate a disaster object', () => {
    const disaster = generateRandomDisaster(testZipData);
    expect(disaster).toBeDefined();
    expect(typeof disaster).toBe('object');
  });

  test('Disaster should have all required fields', () => {
    const disaster = generateRandomDisaster(testZipData);
    expect(disaster).toHaveProperty('type');
    expect(disaster).toHaveProperty('severity');
    expect(disaster).toHaveProperty('status');
    expect(disaster).toHaveProperty('description');
    expect(disaster).toHaveProperty('distance');
    expect(disaster).toHaveProperty('impactTime');
    expect(disaster).toHaveProperty('officialActions');
    expect(disaster).toHaveProperty('timestamp');
  });

  test('Disaster type should be from historical risks', () => {
    const disaster = generateRandomDisaster(testZipData);
    expect(testZipData.historicalRisks).toContain(disaster.type);
  });

  test('Severity should be between 3 and 5', () => {
    for (let i = 0; i < 50; i++) {
      const disaster = generateRandomDisaster(testZipData);
      expect(disaster.severity).toBeGreaterThanOrEqual(3);
      expect(disaster.severity).toBeLessThanOrEqual(5);
    }
  });

  test('Status should match severity level', () => {
    for (let i = 0; i < 50; i++) {
      const disaster = generateRandomDisaster(testZipData);
      const validStatuses = ['watch', 'warning', 'emergency'];
      expect(validStatuses).toContain(disaster.status);

      // Severity 5 should be emergency
      if (disaster.severity === 5) {
        expect(disaster.status).toBe('emergency');
      }
      // Severity 3 should be watch
      if (disaster.severity === 3) {
        expect(disaster.status).toBe('watch');
      }
    }
  });

  test('Distance should be between 1 and 15 miles', () => {
    for (let i = 0; i < 20; i++) {
      const disaster = generateRandomDisaster(testZipData);
      expect(disaster.distance).toBeGreaterThanOrEqual(1);
      expect(disaster.distance).toBeLessThanOrEqual(15);
    }
  });

  test('Official actions should be an array of 5 items', () => {
    const disaster = generateRandomDisaster(testZipData);
    expect(Array.isArray(disaster.officialActions)).toBe(true);
    expect(disaster.officialActions).toHaveLength(5);
  });

  test('All official actions should be non-empty strings', () => {
    const disaster = generateRandomDisaster(testZipData);
    disaster.officialActions.forEach(action => {
      expect(typeof action).toBe('string');
      expect(action.length).toBeGreaterThan(0);
    });
  });

  test('Description should be a non-empty string', () => {
    const disaster = generateRandomDisaster(testZipData);
    expect(typeof disaster.description).toBe('string');
    expect(disaster.description.length).toBeGreaterThan(20);
  });

  test('Impact time should be a non-empty string', () => {
    const disaster = generateRandomDisaster(testZipData);
    expect(typeof disaster.impactTime).toBe('string');
    expect(disaster.impactTime.length).toBeGreaterThan(0);
  });

  test('Timestamp should be valid ISO string', () => {
    const disaster = generateRandomDisaster(testZipData);
    const date = new Date(disaster.timestamp);
    expect(date instanceof Date && !isNaN(date)).toBe(true);
  });

  test('Should generate different disasters on multiple calls', () => {
    const disasters = [];
    for (let i = 0; i < 20; i++) {
      disasters.push(generateRandomDisaster(testZipData));
    }

    // Check that we got some variety in types or severities
    const uniqueTypes = new Set(disasters.map(d => d.type));
    const uniqueSeverities = new Set(disasters.map(d => d.severity));

    expect(uniqueTypes.size).toBeGreaterThan(1);
    expect(uniqueSeverities.size).toBeGreaterThan(1);
  });

  test('All disaster types should be valid', () => {
    const validTypes = ['wildfire', 'flood', 'tsunami', 'earthquake', 'hurricane'];
    for (let i = 0; i < 30; i++) {
      const disaster = generateRandomDisaster(testZipData);
      expect(validTypes).toContain(disaster.type);
    }
  });
});
