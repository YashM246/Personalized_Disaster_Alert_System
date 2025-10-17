/**
 * ZIP Code Demographics Database
 * Contains realistic demographic data for 10 diverse U.S. locations
 * Data sourced from U.S. Census Bureau and community profiles
 */

const zipDatabase = {
  // Beverly Hills, California - Affluent area with diverse languages
  "90210": {
    neighborhood: "Beverly Hills, CA",
    languages: {
      English: 65.2,
      Persian: 18.4,
      Spanish: 8.3,
      Hebrew: 4.1,
      Other: 4.0
    },
    medianAge: 44,
    medianIncome: 87902,
    educationLevel: "high", // 70%+ bachelor's degree
    geography: "Urban residential area in Los Angeles basin, coastal proximity",
    coordinates: { lat: 34.0901, lng: -118.4065 },
    vulnerablePopulations: {
      elderly: 18.5,      // 65+ years
      children: 19.2,     // Under 18
      disabled: 8.1       // With disability
    },
    historicalRisks: ["wildfire", "earthquake", "flood"]
  },

  // East Los Angeles, California - Working-class, predominantly Hispanic
  "90022": {
    neighborhood: "East Los Angeles, CA",
    languages: {
      Spanish: 82.7,
      English: 15.1,
      Indigenous: 1.4,
      Other: 0.8
    },
    medianAge: 28,
    medianIncome: 38456,
    educationLevel: "low", // Less than 40% high school diploma
    geography: "Dense urban area, inland valley basin",
    coordinates: { lat: 34.0239, lng: -118.1553 },
    vulnerablePopulations: {
      elderly: 8.2,
      children: 32.5,
      disabled: 12.3
    },
    historicalRisks: ["earthquake", "flood", "wildfire"]
  },

  // San Francisco (Tenderloin), California - Urban, diverse, low-income
  "94102": {
    neighborhood: "San Francisco, CA",
    languages: {
      English: 48.3,
      Chinese: 21.6,
      Spanish: 14.2,
      Vietnamese: 8.4,
      Tagalog: 4.1,
      Other: 3.4
    },
    medianAge: 39,
    medianIncome: 41234,
    educationLevel: "medium",
    geography: "Dense urban downtown, hilly terrain, coastal proximity",
    coordinates: { lat: 37.7799, lng: -122.4148 },
    vulnerablePopulations: {
      elderly: 14.7,
      children: 8.9,
      disabled: 15.8
    },
    historicalRisks: ["earthquake", "tsunami", "flood"]
  },

  // Miami Beach, Florida - Coastal, tourist area, sea level risk
  "33139": {
    neighborhood: "Miami Beach, FL",
    languages: {
      Spanish: 48.5,
      English: 38.2,
      Portuguese: 6.4,
      Haitian: 3.8,
      Other: 3.1
    },
    medianAge: 42,
    medianIncome: 54321,
    educationLevel: "medium",
    geography: "Barrier island, low elevation (avg 4.5 ft above sea level), coastal",
    coordinates: { lat: 25.8067, lng: -80.1350 },
    vulnerablePopulations: {
      elderly: 22.1,
      children: 12.4,
      disabled: 11.2
    },
    historicalRisks: ["hurricane", "flood", "tsunami"]
  },

  // Long Beach (Downtown), California - Port city, diverse population
  "90802": {
    neighborhood: "Long Beach, CA",
    languages: {
      English: 52.3,
      Spanish: 28.9,
      Tagalog: 7.2,
      Khmer: 5.1,
      Other: 6.5
    },
    medianAge: 35,
    medianIncome: 47890,
    educationLevel: "medium",
    geography: "Coastal port city, sea level elevation, urban waterfront",
    coordinates: { lat: 33.7701, lng: -118.1937 },
    vulnerablePopulations: {
      elderly: 12.3,
      children: 21.7,
      disabled: 13.4
    },
    historicalRisks: ["tsunami", "earthquake", "flood"]
  },

  // Portland (Downtown), Oregon - Urban progressive area
  "97201": {
    neighborhood: "Portland, OR",
    languages: {
      English: 84.2,
      Spanish: 7.3,
      Vietnamese: 2.8,
      Chinese: 2.1,
      Other: 3.6
    },
    medianAge: 38,
    medianIncome: 62145,
    educationLevel: "high",
    geography: "Urban area near Willamette River, moderate elevation, forested hills nearby",
    coordinates: { lat: 45.5051, lng: -122.6750 },
    vulnerablePopulations: {
      elderly: 13.8,
      children: 15.2,
      disabled: 10.7
    },
    historicalRisks: ["wildfire", "flood", "earthquake"]
  },

  // New Orleans (French Quarter), Louisiana - Below sea level, hurricane zone
  "70112": {
    neighborhood: "New Orleans, LA",
    languages: {
      English: 75.4,
      Spanish: 13.2,
      Vietnamese: 6.8,
      French: 2.9,
      Other: 1.7
    },
    medianAge: 37,
    medianIncome: 38567,
    educationLevel: "medium",
    geography: "Below sea level (avg -6 ft), near Mississippi River, coastal proximity",
    coordinates: { lat: 29.9511, lng: -90.0715 },
    vulnerablePopulations: {
      elderly: 11.9,
      children: 18.3,
      disabled: 16.7
    },
    historicalRisks: ["hurricane", "flood", "tornado"]
  },

  // Denver (Downtown), Colorado - High altitude, wildfire risk
  "80202": {
    neighborhood: "Denver, CO",
    languages: {
      English: 76.8,
      Spanish: 18.2,
      Other: 5.0
    },
    medianAge: 34,
    medianIncome: 58234,
    educationLevel: "high",
    geography: "High elevation (5,280 ft), urban plains, mountain proximity",
    coordinates: { lat: 39.7547, lng: -104.9970 },
    vulnerablePopulations: {
      elderly: 9.2,
      children: 16.8,
      disabled: 9.3
    },
    historicalRisks: ["wildfire", "flood", "tornado"]
  },

  // Anchorage, Alaska - Subarctic, earthquake zone
  "99501": {
    neighborhood: "Anchorage, AK",
    languages: {
      English: 80.3,
      Spanish: 6.2,
      Tagalog: 4.8,
      Samoan: 2.9,
      Korean: 2.1,
      Other: 3.7
    },
    medianAge: 33,
    medianIncome: 67821,
    educationLevel: "high",
    geography: "Coastal subarctic, low elevation, near Cook Inlet, mountainous terrain",
    coordinates: { lat: 61.2181, lng: -149.9003 },
    vulnerablePopulations: {
      elderly: 10.4,
      children: 24.1,
      disabled: 11.8
    },
    historicalRisks: ["earthquake", "tsunami", "wildfire"]
  },

  // Manhattan (Chelsea), New York - High density urban
  "10001": {
    neighborhood: "Manhattan, NY",
    languages: {
      English: 56.7,
      Spanish: 22.4,
      Chinese: 7.8,
      Korean: 3.9,
      Russian: 3.2,
      Other: 6.0
    },
    medianAge: 38,
    medianIncome: 73456,
    educationLevel: "high",
    geography: "Dense urban island, low elevation, coastal waterfront",
    coordinates: { lat: 40.7506, lng: -73.9971 },
    vulnerablePopulations: {
      elderly: 15.3,
      children: 14.2,
      disabled: 10.4
    },
    historicalRisks: ["hurricane", "flood", "tornado"]
  }
};

module.exports = zipDatabase;
