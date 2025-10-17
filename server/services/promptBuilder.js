/**
 * LLM Prompt Constructor
 * Builds detailed prompts for Claude API to generate personalized disaster alerts
 */

/**
 * Constructs a comprehensive prompt for generating personalized emergency alerts
 * @param {Object} disaster - Disaster scenario data
 * @param {Object} userContext - User's ZIP code and demographic information
 * @returns {string} Complete prompt for Claude API
 */
function buildAlertPrompt(disaster, userContext) {
  const { zipCode, ...demographics } = userContext;

  // Format languages with percentages
  const languagesFormatted = Object.entries(demographics.languages)
    .map(([lang, percent]) => `${lang}: ${percent}%`)
    .join(', ');

  // Format vulnerable populations
  const vulnerableFormatted = Object.entries(demographics.vulnerablePopulations)
    .map(([group, percent]) => `${group}: ${percent}%`)
    .join(', ');

  const prompt = `You are an emergency alert system AI tasked with creating personalized disaster warnings that save lives.

## DISASTER INFORMATION
- Type: ${disaster.type.toUpperCase()}
- Severity Level: ${disaster.severity}/5 (${disaster.status.toUpperCase()})
- Description: ${disaster.description}
- Distance from User: ${disaster.distance} miles
- Expected Impact Time: ${disaster.impactTime}
- Official Recommendations:
${disaster.officialActions.map((action, i) => `  ${i + 1}. ${action}`).join('\n')}

## COMMUNITY DEMOGRAPHICS (ZIP ${zipCode})
- Location: ${demographics.neighborhood}
- Languages Spoken: ${languagesFormatted}
- Median Age: ${demographics.medianAge} years
- Median Income: $${demographics.medianIncome.toLocaleString()}
- Education Level: ${demographics.educationLevel}
- Geography: ${demographics.geography}
- Vulnerable Populations: ${vulnerableFormatted}

## YOUR TASK
Create a culturally appropriate, linguistically accessible emergency alert that:

1. **Language Selection**: Determine the PRIMARY language (highest percentage above 40%, otherwise English) and identify 2-3 SECONDARY languages (those above 5% speaking rate) for translations.

2. **Reading Level**: Adjust complexity based on education level:
   - Low: 6th grade reading level, simple sentences, common words only
   - Medium: 8th grade reading level, clear but complete sentences
   - High: 10th grade reading level, can use technical terms with context

3. **Urgency Calibration**: Set urgency level (1-5) matching disaster severity and impact time.

4. **Headline**: Create an urgent, actionable headline (MAX 10 words). Include ONE relevant emoji. Make it attention-grabbing and specific to the disaster type and location.

5. **Body Message**: Write 40-60 words that:
   - State the immediate threat clearly
   - Mention the specific distance and timeframe
   - Emphasize the most critical action to take NOW
   - Use culturally appropriate tone (direct for high-education, more community-focused for others)

6. **Actionable Steps**: Provide 3-5 specific, ordered action items that:
   - Are tailored to this specific disaster type and severity
   - Consider the geography and community characteristics
   - Start with the most critical immediate action
   - Use active voice and imperative mood ("Do X", not "You should do X")

7. **Special Considerations**: Provide 2-4 specific notes for vulnerable populations:
   - If elderly population >15%: Include mobility/medication considerations
   - If children >25%: Include child safety specific guidance
   - If disabled population >12%: Include accessibility considerations
   - Make recommendations specific and actionable

8. **Translations**: Provide complete translations of BOTH headline and body in the 2-3 secondary languages identified. Ensure cultural appropriateness and accuracy.

## RESPONSE FORMAT
Return ONLY a valid JSON object (no markdown, no code blocks, no extra text). Use this exact structure:

{
  "primaryLanguage": "language name",
  "secondaryLanguages": ["lang1", "lang2"],
  "readingLevel": "low/medium/high",
  "urgencyLevel": 1-5,
  "headline": "Your headline here with emoji",
  "body": "Your body message here (40-60 words)",
  "actions": [
    "First critical action",
    "Second important action",
    "Third action",
    "Fourth action (optional)",
    "Fifth action (optional)"
  ],
  "specialConsiderations": [
    "Specific guidance for vulnerable group 1",
    "Specific guidance for vulnerable group 2",
    "Specific guidance for vulnerable group 3 (optional)"
  ],
  "translations": {
    "language1": {
      "headline": "Translated headline",
      "body": "Translated body message"
    },
    "language2": {
      "headline": "Translated headline",
      "body": "Translated body message"
    }
  }
}

CRITICAL: Return ONLY the JSON object. No additional text, no markdown code blocks, no explanations.`;

  return prompt;
}

module.exports = { buildAlertPrompt };
