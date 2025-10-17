# Execution Plan for Natural Disaster Alert System

## Project Overview
Build a natural disaster alert demo system that takes ZIP code input, generates a fake disaster scenario, and uses Claude API to create personalized emergency alerts displayed in a web pop-up.

---

## Tech Stack
- **Frontend**: React + Vite + Tailwind CSS
- **Backend**: Node.js + Express API
- **AI**: Anthropic Claude API (claude-sonnet-4-20250514)
- **Deployment**: Local development (can deploy to Vercel/Netlify later)

---

## Project Structure
```
disaster-alert-system/
├── client/                          # React frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── ZipCodeInput.jsx    # ZIP code entry form
│   │   │   ├── AlertPopup.jsx      # Main alert display component
│   │   │   ├── ActionChecklist.jsx # Actionable steps with checkboxes
│   │   │   └── LanguageToggle.jsx  # Switch between translations
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   └── tailwind.config.js
│
├── server/                          # Express backend
│   ├── routes/
│   │   └── alert.js                # POST /api/generate-alert
│   ├── services/
│   │   ├── claudeService.js        # Claude API integration
│   │   └── promptBuilder.js        # LLM prompt construction
│   ├── data/
│   │   ├── zipDatabase.js          # ZIP demographics data (10 ZIPs)
│   │   └── disasterGenerator.js    # Random disaster scenario creator
│   ├── server.js                   # Express app entry point
│   ├── package.json
│   └── .env                        # API keys (ANTHROPIC_API_KEY)
│
└── README.md                        # Setup and demo instructions
```

---

## Phase 1: Backend Setup (Estimated: 30-40 minutes)

### Step 1.1: Initialize Express Server
**Commands:**
```bash
mkdir disaster-alert-system
cd disaster-alert-system
mkdir server client
cd server
npm init -y
npm install express cors dotenv @anthropic-ai/sdk
```

**Create:** `server/server.js`
- Set up Express app with CORS
- Import and use alert routes
- Listen on port 3001
- Add basic error handling

---

### Step 1.2: Create ZIP Demographics Database
**Create:** `server/data/zipDatabase.js`

**Instructions:**
- Export an object with 10 ZIP codes as keys
- Each ZIP should contain:
  - `neighborhood`: "City, State" string
  - `languages`: Object with language names and percentages
  - `medianAge`: Number
  - `medianIncome`: Number
  - `educationLevel`: "low" | "medium" | "high"
  - `geography`: String describing terrain
  - `coordinates`: Object with `lat` and `lng`
  - `vulnerablePopulations`: Object with `elderly`, `children`, `disabled` percentages
  - `historicalRisks`: Array of disaster types

**Sample ZIP Codes to Include:**
- 90210 (Beverly Hills, CA) - High income, wildfire/earthquake risk
- 90022 (East Los Angeles, CA) - Spanish-speaking, earthquake/flood risk
- 94102 (San Francisco, CA) - Urban, earthquake/tsunami risk
- 33139 (Miami Beach, FL) - Coastal, hurricane/flood risk
- 90802 (Long Beach, CA) - Port city, tsunami/earthquake risk
- 97201 (Portland, OR) - Wildfire/flood risk
- 70112 (New Orleans, LA) - Below sea level, hurricane/flood risk
- 80202 (Denver, CO) - High altitude, wildfire/blizzard risk
- 99501 (Anchorage, AK) - Subarctic, earthquake/tsunami risk
- 10001 (Manhattan, NY) - High density, hurricane/flood risk

---

### Step 1.3: Create Disaster Generator
**Create:** `server/services/disasterGenerator.js`

**Instructions:**
- Create array of 5 disaster types: wildfire, flood, tsunami, earthquake, hurricane
- Each disaster type should have 3 severity levels (3, 4, 5)
- Each severity level contains:
  - `level`: Number (3-5)
  - `status`: "watch" | "warning" | "emergency"
  - `description`: String describing the threat
  - `impactTime`: String (e.g., "30 minutes", "2 hours")
  - `officialActions`: Array of 5 recommended actions

**Create function:** `generateRandomDisaster(zipData)`
- Select disaster type based on ZIP's `historicalRisks`
- Randomly pick severity level (weighted: 10% level 5, 40% level 4, 50% level 3)
- Generate random distance between 1-15 miles
- Return disaster object with all properties
- Export function

---

### Step 1.4: Build LLM Prompt Constructor
**Create:** `server/services/promptBuilder.js`

**Instructions:**
- Create function: `buildAlertPrompt(disaster, userContext)`
- Construct detailed prompt for Claude containing:
  - **Disaster Information Section:**
    - Type, severity, status, description
    - Distance from user
    - Expected impact time
    - Official recommendations
  - **Community Demographics Section:**
    - ZIP code and neighborhood
    - Languages spoken (formatted as percentages)
    - Median age and income
    - Education level
    - Geography type
    - Vulnerable population percentages
  - **Task Instructions:**
    - Determine primary language
    - Set reading complexity level
    - Create urgent headline (max 10 words with emoji)
    - Write body message (max 60 words)
    - Provide 3-5 actionable steps
    - Include special considerations for vulnerable groups
    - Provide translations in top 2-3 community languages
  - **Response Format:**
    - Specify exact JSON structure expected
    - Include fields: primaryLanguage, secondaryLanguages, readingLevel, urgencyLevel, headline, body, actions array, specialConsiderations array, translations object
    - Emphasize: "Return ONLY valid JSON. No markdown, no code blocks."
- Return complete prompt string
- Export function

---

### Step 1.5: Create Claude API Service
**Create:** `server/services/claudeService.js`

**Instructions:**
- Import Anthropic SDK
- Initialize client with API key from environment variable
- Create async function: `generatePersonalizedAlert(prompt)`
- Call Claude API with:
  - Model: `claude-sonnet-4-20250514`
  - Max tokens: 2048
  - Temperature: 0.7
  - Pass prompt as user message
- Parse response:
  - Extract text from response
  - Remove markdown code blocks if present (```json and ```)
  - Parse as JSON
- Error handling:
  - Try-catch block
  - Log errors to console
  - Return fallback response object if API fails
- Fallback response should include:
  - Basic alert structure
  - Generic English headline and body
  - 5 general safety actions
  - 3 general special considerations
  - Spanish translation only
- Export function

---

### Step 1.6: Create API Route
**Create:** `server/routes/alert.js`

**Instructions:**
- Import Express router
- Import zipDatabase, generateRandomDisaster, buildAlertPrompt, generatePersonalizedAlert
- Create POST endpoint: `/generate-alert`
  - Accept `zipCode` from request body
  - Validate ZIP code (5 digits, numeric only)
  - Return 400 if invalid format
  - Check if ZIP exists in database
  - Return 404 if not found (include list of available ZIPs)
  - Call `generateRandomDisaster(zipData)` to create scenario
  - Build user context object with ZIP code and all ZIP data
  - Call `buildAlertPrompt(disaster, userContext)`
  - Call `generatePersonalizedAlert(prompt)` with Claude API
  - Combine results into response object with sections:
    - `disaster`: type, severity, status, distance, impactTime, timestamp
    - `alert`: full LLM response
    - `location`: zipCode, neighborhood
  - Return JSON response
  - Add try-catch for 500 errors
- Create GET endpoint: `/health`
  - Return status and timestamp
- Export router

---

### Step 1.7: Environment Variables
**Create:** `server/.env`
- Add `ANTHROPIC_API_KEY=your_api_key_here`
- Add `PORT=3001`

**Create:** `server/.env.example`
- Add `ANTHROPIC_API_KEY=sk-ant-xxxxx`
- Add `PORT=3001`

**Add to .gitignore:**
```
.env
node_modules/
```

---

## Phase 2: Frontend Setup (Estimated: 60-80 minutes)

### Step 2.1: Initialize React App
**Commands:**
```bash
cd ../client
npm create vite@latest . -- --template react
npm install
npm install axios
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

**Configure:** `client/tailwind.config.js`
- Set content paths to include all JSX/TSX files
- Extend theme colors:
  - `critical`: '#DC2626' (red)
  - `high`: '#EA580C' (orange)
  - `moderate`: '#F59E0B' (yellow)

**Update:** `client/src/index.css`
- Add Tailwind directives: @tailwind base, components, utilities
- Add basic body styling with system fonts

---

### Step 2.2: Create ZIP Code Input Component
**Create:** `client/src/components/ZipCodeInput.jsx`

**Instructions:**
- Accept props: `onSubmit` (function), `loading` (boolean)
- Use useState for:
  - `zipCode` (string)
  - `error` (string)
- Create array of sample ZIPs for quick selection
- Create `handleSubmit` function:
  - Prevent default form submission
  - Validate ZIP is 5 digits
  - Set error if invalid
  - Call `onSubmit(zipCode)` if valid
- Create `handleQuickSelect` function:
  - Set zipCode to clicked sample
  - Clear error
- Render:
  - Full-page centered layout with gradient background
  - White card with rounded corners and shadow
  - Title: "🚨 Disaster Alert System"
  - Subtitle explaining purpose
  - Form with ZIP input field:
    - Restrict to 5 numeric digits
    - Show error message below if present
    - Disable when loading
  - Submit button:
    - Full width, blue background
    - Show loading spinner when loading
    - Disable when loading or ZIP invalid
    - Text: "Generate Emergency Alert"
  - Grid of quick-select ZIP buttons below form
  - Info section at bottom with demo details
- Export component

---

### Step 2.3: Create Alert Popup Component
**Create:** `client/src/components/AlertPopup.jsx`

**Instructions:**
- Accept props: `alertData` (object), `onClose` (function)
- Use useState for:
  - `selectedLanguage` (string, default "English")
  - `checkedActions` (array of indices)
- Destructure alertData: `disaster`, `alert`, `location`
- Create severity color mapping object (5 colors for severity 1-5)
- Determine current headline and body based on selectedLanguage
- Get available languages: English + keys from translations object
- Render:
  - Fixed fullscreen overlay with dark semi-transparent background
  - Centered white modal card with rounded corners
  - Header section with severity-colored banner:
    - Disaster type icon/emoji
    - Severity badge
    - Close button (X) in top-right
  - Location info: ZIP code and neighborhood name
  - Distance and impact time display
  - Language toggle component (pass availableLanguages and selectedLanguage)
  - Headline (large, bold, with emoji)
  - Body text (readable paragraph)
  - Actions section:
    - Import and use ActionChecklist component
    - Pass actions array and checkedActions state
  - Special Considerations section:
    - Icon for each consideration type (elderly, children, disabled)
    - Display each consideration as card or list item
  - Bottom section with:
    - Timestamp
    - Official source attribution
    - "Get Updates" button (placeholder)
- Add animations: fade-in on mount
- Export component

---

### Step 2.4: Create Action Checklist Component
**Create:** `client/src/components/ActionChecklist.jsx`

**Instructions:**
- Accept props: `actions` (array), `checkedActions` (array), `onToggle` (function)
- Render:
  - Section title: "📋 Actions to Take"
  - Ordered list of action items
  - Each item should be:
    - Checkbox (controlled by checkedActions state)
    - Action text (strike-through if checked)
    - onClick handler calls onToggle with index
  - Style checked items with green checkmark and muted text
  - Progress indicator showing X of Y completed
- Export component

---

### Step 2.5: Create Language Toggle Component
**Create:** `client/src/components/LanguageToggle.jsx`

**Instructions:**
- Accept props: `languages` (array), `selectedLanguage` (string), `onChange` (function)
- Render:
  - Horizontal button group
  - One button for each language in languages array
  - Highlight selected language with blue background
  - Non-selected languages have gray background
  - onClick calls onChange with language name
  - Include language flag emoji before language name (optional)
- Export component

---

### Step 2.6: Create Main App Component
**Create:** `client/src/App.jsx`

**Instructions:**
- Import axios, useState components
- Use useState for:
  - `alertData` (null initially)
  - `loading` (boolean)
  - `error` (string)
- Create async function: `handleGenerateAlert(zipCode)`
  - Set loading to true, clear error
  - Make POST request to `http://localhost:3001/api/generate-alert`
  - Send `{ zipCode }` in body
  - On success: set alertData to response.data
  - On error: set error message, log to console
  - Finally: set loading to false
- Create function: `handleCloseAlert()`
  - Set alertData to null
  - Optionally show thank you message
- Render:
  - If no alertData: show ZipCodeInput component
  - If alertData: show AlertPopup component
  - Pass appropriate props to each
  - Show error toast/banner if error exists
- Export App component

---

### Step 2.7: Update Main Entry Point
**Update:** `client/src/main.jsx`

**Instructions:**
- Import React, ReactDOM, App, and index.css
- Render App component in StrictMode
- Mount to root element

---

### Step 2.8: Update HTML Template
**Update:** `client/index.html`

**Instructions:**
- Set page title: "Disaster Alert System - AI-Powered Emergency Alerts"
- Add meta description
- Add favicon (optional)
- Include root div with id="root"

---

## Phase 3: Integration & Testing (Estimated: 20-30 minutes)

### Step 3.1: Test Backend Independently
**Commands:**
```bash
cd server
node server.js
```

**Test with curl or Postman:**
```bash
curl -X POST http://localhost:3001/api/generate-alert \
  -H "Content-Type: application/json" \
  -d '{"zipCode":"90210"}'
```

**Verify:**
- Server starts without errors
- Health endpoint returns OK
- Alert endpoint returns valid JSON
- LLM response includes all required fields
- Translations are present
- Actions array has 3-5 items

---

### Step 3.2: Test Frontend Independently
**Commands:**
```bash
cd client
npm run dev
```

**Verify:**
- Page loads without errors
- ZIP input accepts only 5 digits
- Quick select buttons work
- Validation shows errors for invalid input
- Loading state displays correctly

---

### Step 3.3: Test Full Integration
**Start both servers:**
- Terminal 1: `cd server && node server.js`
- Terminal 2: `cd client && npm run dev`

**Test flow:**
1. Enter ZIP code 90210
2. Click "Generate Emergency Alert"
3. Verify loading spinner appears
4. Verify popup appears with alert
5. Test language toggle
6. Check/uncheck action items
7. Close popup
8. Try different ZIP codes
9. Test with invalid ZIP (should show error)
10. Test with unknown ZIP (should show available ZIPs)

---

### Step 3.4: Error Handling Tests
**Test scenarios:**
- Invalid API key (should show fallback response)
- Network timeout (should show error message)
- Malformed ZIP code
- ZIP not in database
- LLM returns invalid JSON (should use fallback)

---

## Phase 4: Polish & Documentation (Estimated: 15-20 minutes)

### Step 4.1: Add Loading States
- Skeleton loaders for popup sections
- Spinner animations
- Disable interactions during loading
- Progress indicators

---

### Step 4.2: Improve Styling
- Consistent color scheme
- Hover effects on buttons
- Smooth transitions
- Responsive design (mobile-friendly)
- Accessibility: keyboard navigation, ARIA labels
- High contrast mode support

---

### Step 4.3: Add Animations
- Fade-in for popup
- Slide-in for alerts
- Checkbox animations
- Language switch transitions

---

### Step 4.4: Create README
**Create:** `README.md` in root directory

**Include sections:**
- Project title and description
- Features list
- Tech stack
- Prerequisites (Node.js, npm, Anthropic API key)
- Installation instructions
- Environment setup
- Running the application
- Available ZIP codes for demo
- API endpoints documentation
- Project structure
- How it works (brief explanation)
- Future enhancements
- License

---

### Step 4.5: Code Comments
- Add JSDoc comments to functions
- Explain complex logic
- Document API schemas
- Add inline comments for non-obvious code

---

### Step 4.6: Clean Up
- Remove console.logs (except errors)
- Delete unused imports
- Format code consistently
- Check for typos
- Remove commented-out code

---

## Phase 5: Demo Preparation (Estimated: 10-15 minutes)

### Step 5.1: Prepare Demo Script
**Create:** `DEMO_SCRIPT.md`

**Include:**
- Introduction (30 seconds)
- Problem statement (30 seconds)
- Live demo walkthrough (60 seconds):
  - Enter high-income ZIP (90210)
  - Show personalized alert
  - Toggle to Persian translation
  - Show actions
  - Enter low-income ZIP (90022)
  - Show Spanish translation
  - Compare messaging differences
- Technical highlights (30 seconds)
- Impact and future vision (30 seconds)

---

### Step 5.2: Create Slide Deck (Optional)
- Problem: Language barriers in emergencies
- Solution: AI-powered personalized alerts
- Demo screenshots
- Technical architecture diagram
- Impact metrics (potential reach)
- Next steps

---

### Step 5.3: Record Demo Video
- Screen recording of full flow
- Show 2-3 different ZIP codes
- Highlight language translations
- Show action checklist
- Keep under 2 minutes

---

### Step 5.4: Prepare for Questions
**Anticipated questions:**
- How does this scale to real-time alerts?
- What about users without internet?
- How do you handle API failures?
- Cost of Claude API calls?
- Privacy concerns with ZIP codes?
- Integration with existing alert systems?
- Accessibility for screen readers?

**Prepare answers for each**

---

## Deliverables Checklist

- [ ] Working backend API with Claude integration
- [ ] Working frontend with alert popup
- [ ] 10 ZIP codes with complete demographic data
- [ ] 5 disaster types with 3 severity levels each
- [ ] Multi-language translation support
- [ ] Action checklist with checkboxes
- [ ] Special considerations display
- [ ] README with setup instructions
- [ ] .env.example file
- [ ] Error handling throughout
- [ ] Responsive design
- [ ] Demo script
- [ ] GitHub repository (optional)
- [ ] Video demo (optional)

---

## Time Estimate Summary

| Phase | Tasks | Estimated Time |
|-------|-------|----------------|
| Phase 1 | Backend Setup | 30-40 minutes |
| Phase 2 | Frontend Setup | 60-80 minutes |
| Phase 3 | Integration & Testing | 20-30 minutes |
| Phase 4 | Polish & Documentation | 15-20 minutes |
| Phase 5 | Demo Preparation | 10-15 minutes |
| **Total** | | **2.5-3.5 hours** |

---

## Success Criteria

**Functional Requirements:**
- ✅ User can enter any of 10 ZIP codes
- ✅ System generates random disaster scenario
- ✅ Claude API returns personalized alert
- ✅ Alert displays in popup with all fields
- ✅ User can toggle between languages
- ✅ User can check off action items
- ✅ Special considerations are shown
- ✅ Error states handled gracefully

**Technical Requirements:**
- ✅ Backend responds in <3 seconds
- ✅ Frontend is mobile-responsive
- ✅ No console errors in normal flow
- ✅ API failures don't crash app
- ✅ Code is clean and documented

**Demo Requirements:**
- ✅ Can demonstrate full flow in 2 minutes
- ✅ Shows personalization differences
- ✅ Highlights AI integration
- ✅ Explains social impact

---

## Notes for Claude Code

- This is a complete full-stack application
- Backend and frontend run separately
- Use modern ES6+ syntax
- Follow React best practices
- Implement proper error boundaries
- Use semantic HTML
- Add PropTypes or TypeScript if time permits
- Keep components small and focused
- Test incrementally as you build
- Commit frequently to Git
- Ask clarifying questions if specifications are unclear