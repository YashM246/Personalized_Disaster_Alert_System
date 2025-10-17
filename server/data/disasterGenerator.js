/**
 * Disaster Scenario Generator
 * Generates realistic disaster scenarios with appropriate severity levels
 */

const disasterTemplates = {
  wildfire: {
    3: {
      level: 3,
      status: "watch",
      description: "Vegetation fire spreading in dry conditions with moderate winds. Fire crews actively engaged in containment efforts.",
      impactTime: "4-6 hours",
      officialActions: [
        "Monitor local news and emergency alerts continuously",
        "Prepare an evacuation kit with essentials (water, medications, documents)",
        "Close all windows and doors to prevent smoke infiltration",
        "Create defensible space around your property by clearing vegetation",
        "Identify multiple evacuation routes from your neighborhood"
      ]
    },
    4: {
      level: 4,
      status: "warning",
      description: "Rapidly spreading wildfire with high winds and low humidity. Multiple structures threatened. Evacuation orders likely within hours.",
      impactTime: "1-2 hours",
      officialActions: [
        "Evacuate immediately if in fire zone or upon official order",
        "Turn off gas, propane, and pilot lights before leaving",
        "Close all windows and doors, but leave them unlocked for firefighters",
        "Move combustible materials away from your home exterior",
        "Gather family members and pets, drive with headlights on through smoke"
      ]
    },
    5: {
      level: 5,
      status: "emergency",
      description: "Explosive fire behavior with extreme winds creating firestorms. Immediate life-threatening situation. Multiple neighborhoods under mandatory evacuation.",
      impactTime: "30-60 minutes",
      officialActions: [
        "EVACUATE NOW - Do not wait for additional warnings",
        "Take only essential items and get out immediately",
        "If trapped, go to a cleared area away from vegetation",
        "Call 911 to report your location if unable to evacuate",
        "Use wet cloth over nose and mouth, stay low to avoid smoke inhalation"
      ]
    }
  },

  flood: {
    3: {
      level: 3,
      status: "watch",
      description: "Heavy rainfall causing rising water levels in rivers and streams. Flash flooding possible in low-lying areas and near waterways.",
      impactTime: "3-5 hours",
      officialActions: [
        "Move valuable items and electronics to higher floors",
        "Monitor weather updates and local water level reports",
        "Avoid driving through standing water of unknown depth",
        "Prepare sandbags for doorways if you live in flood-prone area",
        "Know your evacuation route to higher ground"
      ]
    },
    4: {
      level: 4,
      status: "warning",
      description: "Major flooding in progress with rapidly rising water. Roads becoming impassable. Water entering structures in low-lying areas.",
      impactTime: "1-2 hours",
      officialActions: [
        "Evacuate to higher ground immediately if ordered",
        "Never walk or drive through floodwater (6 inches can knock you down)",
        "Turn off utilities at main switches if water is approaching",
        "Move to highest level of your building if unable to evacuate",
        "Stay off bridges over fast-moving water"
      ]
    },
    5: {
      level: 5,
      status: "emergency",
      description: "Catastrophic flooding with life-threatening water levels. Dam failure or levee breach imminent. Flash flooding sweeping away vehicles and structures.",
      impactTime: "Immediate",
      officialActions: [
        "GET TO HIGH GROUND IMMEDIATELY - Life-threatening emergency",
        "If trapped in building, go to highest floor, not attic (risk of entrapment)",
        "Signal for help but stay where you are if water is too deep",
        "Do not attempt to swim through flowing water",
        "Call 911 and provide exact location if stranded"
      ]
    }
  },

  tsunami: {
    3: {
      level: 3,
      status: "watch",
      description: "Distant earthquake has generated tsunami waves. Potential for dangerous currents and waves at beaches and harbors. No immediate threat to coastal residents.",
      impactTime: "2-4 hours",
      officialActions: [
        "Stay informed through NOAA tsunami alerts and local authorities",
        "Avoid beaches, harbors, and coastal areas below 100 feet elevation",
        "Review tsunami evacuation routes in your area",
        "Prepare evacuation supplies in case watch is upgraded",
        "Do not go to the shore to observe waves - tsunamis can arrive suddenly"
      ]
    },
    4: {
      level: 4,
      status: "warning",
      description: "Tsunami waves confirmed and approaching coastline. Dangerous wave action and strong currents expected. Coastal flooding possible for several hours.",
      impactTime: "30-90 minutes",
      officialActions: [
        "Evacuate immediately to high ground at least 100 feet above sea level",
        "Move at least 2 miles inland if no high ground is available",
        "Leave immediately - do not wait to gather belongings",
        "Go on foot if traffic is congested - do not stay in car",
        "Stay away from coast for several hours - multiple waves will arrive"
      ]
    },
    5: {
      level: 5,
      status: "emergency",
      description: "Major tsunami waves arriving imminently. Waves over 10 feet confirmed. Catastrophic inundation expected along entire coastline. Immediate life-threatening danger.",
      impactTime: "15-30 minutes",
      officialActions: [
        "EVACUATE TO HIGH GROUND NOW - Run, do not walk",
        "If unable to escape, climb to upper floors or roof of sturdy building",
        "Climb trees or grab floating debris only as absolute last resort",
        "Do not return until ALL-CLEAR issued - waves continue for hours",
        "If swept up in wave, protect head and try to stay afloat"
      ]
    }
  },

  earthquake: {
    3: {
      level: 3,
      status: "watch",
      description: "Moderate earthquake (5.5-6.0 magnitude) has occurred. Aftershocks expected. Minor structural damage possible. No immediate widespread danger.",
      impactTime: "Ongoing",
      officialActions: [
        "Check yourself and others for injuries, provide first aid if trained",
        "Inspect home for structural damage, gas leaks, and electrical issues",
        "Prepare for aftershocks - expect strong shaking to recur",
        "Turn off gas if you smell it or suspect a leak",
        "Stay out of damaged buildings until inspected by professionals"
      ]
    },
    4: {
      level: 4,
      status: "warning",
      description: "Strong earthquake (6.0-6.9 magnitude) with significant shaking. Structural damage occurring. Gas leaks and fires reported. Major aftershocks likely.",
      impactTime: "Ongoing",
      officialActions: [
        "If indoors, DROP, COVER, and HOLD ON during aftershocks",
        "Evacuate damaged buildings immediately - use stairs, not elevators",
        "Stay away from windows, heavy furniture, and unsecured objects",
        "If trapped in debris, do not light matches - tap on pipes to signal location",
        "Avoid coastal areas - earthquake may generate tsunami"
      ]
    },
    5: {
      level: 5,
      status: "emergency",
      description: "Major earthquake (7.0+ magnitude) causing catastrophic damage. Widespread structural failures. Mass casualties reported. Infrastructure severely compromised.",
      impactTime: "Ongoing",
      officialActions: [
        "Protect yourself from falling debris - stay in safe location if possible",
        "If trapped, remain calm, cover mouth with cloth, tap rhythmically for rescue",
        "Do not enter damaged structures - risk of collapse in aftershocks",
        "Avoid all bridges, overpasses, and elevated roadways",
        "Conserve phone battery - send texts instead of calls, only call 911 for emergencies"
      ]
    }
  },

  hurricane: {
    3: {
      level: 3,
      status: "watch",
      description: "Category 2 hurricane approaching (96-110 mph winds). Storm surge 6-8 feet possible. Extensive damage expected to roofs, trees, and power lines.",
      impactTime: "12-24 hours",
      officialActions: [
        "Complete all preparations - board windows, secure outdoor items",
        "Stock up on food, water (1 gallon per person per day for 7 days)",
        "Fill vehicles with gas, charge all electronic devices",
        "Review evacuation plan with family members",
        "Prepare to evacuate if ordered by authorities"
      ]
    },
    4: {
      level: 4,
      status: "warning",
      description: "Category 3-4 hurricane imminent (111-155 mph winds). Storm surge 9-18 feet. Catastrophic damage expected. Area may be uninhabitable for weeks or months.",
      impactTime: "6-12 hours",
      officialActions: [
        "Evacuate NOW if in storm surge zone or mobile home",
        "If unable to evacuate, move to interior room away from windows",
        "Turn off utilities if flooding expected",
        "Take refuge in designated shelter if home is not safe",
        "Stay indoors during entire storm - eye of hurricane is deceptive"
      ]
    },
    5: {
      level: 5,
      status: "emergency",
      description: "Category 4-5 hurricane with catastrophic winds (155+ mph) and storm surge over 18 feet. Complete destruction of frame homes expected. Area will be uninhabitable for months.",
      impactTime: "3-6 hours",
      officialActions: [
        "FINAL CHANCE TO EVACUATE - Leave immediately if possible",
        "If unable to leave, take shelter in small interior room, closet, or hallway",
        "Get under sturdy furniture, protect head and body from debris",
        "Stay away from windows - lie on floor if breaking occurs",
        "Do not leave shelter until authorities declare all-clear (12+ hours)"
      ]
    }
  }
};

/**
 * Generates a random disaster scenario based on ZIP code risk profile
 * @param {Object} zipData - Demographics and risk data for the ZIP code
 * @returns {Object} Complete disaster scenario with all details
 */
function generateRandomDisaster(zipData) {
  // Select disaster type weighted by historical risks
  const historicalRisks = zipData.historicalRisks;
  const disasterType = historicalRisks[Math.floor(Math.random() * historicalRisks.length)];

  // Weighted random severity selection (more moderate events than extreme)
  const rand = Math.random();
  let severityLevel;
  if (rand < 0.10) {
    severityLevel = 5;  // 10% chance - catastrophic
  } else if (rand < 0.50) {
    severityLevel = 4;  // 40% chance - severe
  } else {
    severityLevel = 3;  // 50% chance - moderate
  }

  // Get disaster template
  const disasterData = disasterTemplates[disasterType][severityLevel];

  // Generate random distance (1-15 miles from user)
  const distance = Math.floor(Math.random() * 15) + 1;

  // Generate timestamp
  const timestamp = new Date().toISOString();

  return {
    type: disasterType,
    severity: severityLevel,
    status: disasterData.status,
    description: disasterData.description,
    distance: distance,
    impactTime: disasterData.impactTime,
    officialActions: disasterData.officialActions,
    timestamp: timestamp
  };
}

module.exports = { generateRandomDisaster };
