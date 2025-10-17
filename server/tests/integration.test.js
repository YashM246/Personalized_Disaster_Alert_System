/**
 * Integration Tests
 * Tests the full flow from ZIP code to alert generation
 */

const { generateRandomDisaster } = require('../data/disasterGenerator');
const { buildAlertPrompt } = require('../services/promptBuilder');
const { generatePersonalizedAlert } = require('../services/geminiService');
const zipDatabase = require('../data/zipDatabase');

describe('Full Integration Tests', () => {

  test('Complete flow: ZIP to disaster to prompt to alert', async () => {
    // Step 1: Get ZIP data
    const zipCode = '90210';
    const zipData = zipDatabase[zipCode];
    expect(zipData).toBeDefined();

    // Step 2: Generate disaster
    const disaster = generateRandomDisaster(zipData);
    expect(disaster).toBeDefined();
    expect(disaster).toHaveProperty('type');

    // Step 3: Build user context
    const userContext = {
      zipCode,
      ...zipData
    };

    // Step 4: Build prompt
    const prompt = buildAlertPrompt(disaster, userContext);
    expect(prompt).toBeDefined();
    expect(prompt.length).toBeGreaterThan(100);

    // Step 5: Generate alert
    const alert = await generatePersonalizedAlert(prompt);
    expect(alert).toBeDefined();
    expect(alert).toHaveProperty('headline');
    expect(alert).toHaveProperty('body');
    expect(alert).toHaveProperty('actions');
  }, 15000);

  test('Multiple ZIP codes through full flow', async () => {
    const zipCodes = ['90210', '90022', '94102'];

    for (const zipCode of zipCodes) {
      const zipData = zipDatabase[zipCode];
      const disaster = generateRandomDisaster(zipData);
      const userContext = { zipCode, ...zipData };
      const prompt = buildAlertPrompt(disaster, userContext);
      const alert = await generatePersonalizedAlert(prompt);

      expect(alert).toHaveProperty('headline');
      expect(alert.actions.length).toBeGreaterThan(0);
    }
  }, 30000);

  test('Disaster data flows correctly to prompt', () => {
    const zipData = zipDatabase['90210'];
    const disaster = generateRandomDisaster(zipData);
    const userContext = { zipCode: '90210', ...zipData };
    const prompt = buildAlertPrompt(disaster, userContext);

    // Verify disaster info in prompt
    expect(prompt).toContain(disaster.type);
    expect(prompt).toContain(disaster.severity.toString());
    expect(prompt).toContain(disaster.distance.toString());
  });

  test('ZIP demographics flow correctly to prompt', () => {
    const zipData = zipDatabase['90022'];
    const disaster = generateRandomDisaster(zipData);
    const userContext = { zipCode: '90022', ...zipData };
    const prompt = buildAlertPrompt(disaster, userContext);

    // Verify demographics in prompt
    expect(prompt).toContain('90022');
    expect(prompt).toContain(zipData.neighborhood);
    expect(prompt).toContain('Spanish');
    expect(prompt).toContain(zipData.medianAge.toString());
  });

  test('Different disaster types generate different prompts', () => {
    const zipData = zipDatabase['90210'];
    const prompts = new Set();

    for (let i = 0; i < 10; i++) {
      const disaster = generateRandomDisaster(zipData);
      const userContext = { zipCode: '90210', ...zipData };
      const prompt = buildAlertPrompt(disaster, userContext);
      prompts.add(prompt.substring(0, 200)); // Compare first 200 chars
    }

    // We should get some variation in prompts
    expect(prompts.size).toBeGreaterThan(1);
  });

  test('Alert structure is consistent across all ZIP codes', async () => {
    const zipCodes = Object.keys(zipDatabase);
    const alerts = [];

    for (const zipCode of zipCodes.slice(0, 3)) {
      const zipData = zipDatabase[zipCode];
      const disaster = generateRandomDisaster(zipData);
      const userContext = { zipCode, ...zipData };
      const prompt = buildAlertPrompt(disaster, userContext);
      const alert = await generatePersonalizedAlert(prompt);
      alerts.push(alert);
    }

    // All alerts should have same structure
    alerts.forEach(alert => {
      expect(alert).toHaveProperty('primaryLanguage');
      expect(alert).toHaveProperty('headline');
      expect(alert).toHaveProperty('body');
      expect(alert).toHaveProperty('actions');
      expect(alert).toHaveProperty('specialConsiderations');
      expect(alert).toHaveProperty('translations');
    });
  }, 30000);

  test('High severity disasters appear in prompts', () => {
    const zipData = zipDatabase['70112'];
    let foundSeverity5 = false;

    // Generate multiple disasters until we get a severity 5
    for (let i = 0; i < 50 && !foundSeverity5; i++) {
      const disaster = generateRandomDisaster(zipData);
      if (disaster.severity === 5) {
        foundSeverity5 = true;
        const userContext = { zipCode: '70112', ...zipData };
        const prompt = buildAlertPrompt(disaster, userContext);

        expect(prompt).toContain('5');
        expect(prompt.toLowerCase()).toContain('emergency');
      }
    }

    // We should have found at least one severity 5 in 50 tries
    expect(foundSeverity5).toBe(true);
  });

  test('Language preferences reflect in prompts', () => {
    // Beverly Hills - Persian speakers
    const zipData1 = zipDatabase['90210'];
    const disaster1 = generateRandomDisaster(zipData1);
    const prompt1 = buildAlertPrompt(disaster1, { zipCode: '90210', ...zipData1 });
    expect(prompt1).toContain('Persian');

    // East LA - Spanish speakers
    const zipData2 = zipDatabase['90022'];
    const disaster2 = generateRandomDisaster(zipData2);
    const prompt2 = buildAlertPrompt(disaster2, { zipCode: '90022', ...zipData2 });
    expect(prompt2).toContain('Spanish');
    expect(prompt2).toContain('82.7'); // High Spanish percentage
  });

  test('Education level affects prompt instructions', () => {
    // High education
    const zipData1 = zipDatabase['90210'];
    const disaster1 = generateRandomDisaster(zipData1);
    const prompt1 = buildAlertPrompt(disaster1, { zipCode: '90210', ...zipData1 });
    expect(prompt1).toContain('high');

    // Low education
    const zipData2 = zipDatabase['90022'];
    const disaster2 = generateRandomDisaster(zipData2);
    const prompt2 = buildAlertPrompt(disaster2, { zipCode: '90022', ...zipData2 });
    expect(prompt2).toContain('low');
  });
});
