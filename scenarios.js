/**
 * Disaster Response Logistics Optimization System (EOC)
 * 10 Preloaded Disaster Scenarios Across Nepal
 * Authentic topological networks, nodes, corridors, supplies, and casualty demands.
 */

export const SCENARIOS_DATA = [
    {
        id: "SCENARIO_1",
        name: "Kathmandu Earthquake (M7.8)",
        category: "Earthquake",
        severity: "CRITICAL",
        location: "Kathmandu Valley, Bagmati Province",
        description: "Catastrophic seismic event along the Main Himalayan Thrust. Severe structural damage, building collapses, and blocked arterial transit corridors across the urban core.",
        centerLat: 27.7172,
        centerLng: 85.3240,
        nodes: [
            { id: "N_1_DEPOT", scenarioId: "SCENARIO_1", name: "TIA Air Cargo Depot", type: "Depot", lat: 27.6966, lng: 85.3591, capacity: 5000, availableResources: 2500, priority: 1 },
            { id: "N_1_HOSP1", scenarioId: "SCENARIO_1", name: "Bir Trauma Center", type: "Hospital", lat: 27.7052, lng: 85.3135, capacity: 1200, availableResources: 450, priority: 1 },
            { id: "N_1_HOSP2", scenarioId: "SCENARIO_1", name: "TUTH Teaching Hospital", type: "Hospital", lat: 27.7355, lng: 85.3306, capacity: 1500, availableResources: 600, priority: 2 },
            { id: "N_1_SHEL1", scenarioId: "SCENARIO_1", name: "Tundikhel Open Field Camp", type: "Shelter", lat: 27.7018, lng: 85.3150, capacity: 3500, availableResources: 120, priority: 1 },
            { id: "N_1_SHEL2", scenarioId: "SCENARIO_1", name: "Bhaktapur Durbar Shelter", type: "Shelter", lat: 27.6710, lng: 85.4298, capacity: 2000, availableResources: 80, priority: 2 },
            { id: "N_1_SHEL3", scenarioId: "SCENARIO_1", name: "Patan Jawalakhel Shelter", type: "Shelter", lat: 27.6725, lng: 85.3148, capacity: 1800, availableResources: 90, priority: 3 },
            { id: "N_1_SHEL4", scenarioId: "SCENARIO_1", name: "Kirtipur Evacuation Site", type: "Shelter", lat: 27.6800, lng: 85.2750, capacity: 1400, availableResources: 60, priority: 4 }
        ],
        edges: [
            { id: "E_1_1", scenarioId: "SCENARIO_1", sourceId: "N_1_DEPOT", destId: "N_1_HOSP1", distance: 6.8, travelTime: 22.0, capacity: 250, riskLevel: 2, disruptionProb: 0.15, status: "Open" },
            { id: "E_1_2", scenarioId: "SCENARIO_1", sourceId: "N_1_DEPOT", destId: "N_1_HOSP2", distance: 7.5, travelTime: 25.0, capacity: 200, riskLevel: 1, disruptionProb: 0.10, status: "Open" },
            { id: "E_1_3", scenarioId: "SCENARIO_1", sourceId: "N_1_HOSP1", destId: "N_1_SHEL1", distance: 1.2, travelTime: 5.0, capacity: 300, riskLevel: 3, disruptionProb: 0.35, status: "Open" },
            { id: "E_1_4", scenarioId: "SCENARIO_1", sourceId: "N_1_DEPOT", destId: "N_1_SHEL2", distance: 11.4, travelTime: 38.0, capacity: 180, riskLevel: 3, disruptionProb: 0.40, status: "Blocked" },
            { id: "E_1_5", scenarioId: "SCENARIO_1", sourceId: "N_1_SHEL1", destId: "N_1_SHEL3", distance: 4.8, travelTime: 18.0, capacity: 220, riskLevel: 2, disruptionProb: 0.20, status: "Open" },
            { id: "E_1_6", scenarioId: "SCENARIO_1", sourceId: "N_1_SHEL3", destId: "N_1_SHEL4", distance: 5.1, travelTime: 19.0, capacity: 150, riskLevel: 2, disruptionProb: 0.25, status: "Open" },
            { id: "E_1_7", scenarioId: "SCENARIO_1", sourceId: "N_1_HOSP2", destId: "N_1_SHEL1", distance: 4.9, travelTime: 16.0, capacity: 200, riskLevel: 1, disruptionProb: 0.12, status: "Open" },
            { id: "E_1_8", scenarioId: "SCENARIO_1", sourceId: "N_1_HOSP1", destId: "N_1_SHEL4", distance: 6.2, travelTime: 24.0, capacity: 160, riskLevel: 3, disruptionProb: 0.30, status: "Open" },
            { id: "E_1_9", scenarioId: "SCENARIO_1", sourceId: "N_1_SHEL2", destId: "N_1_SHEL3", distance: 12.0, travelTime: 40.0, capacity: 140, riskLevel: 2, disruptionProb: 0.25, status: "Open" }
        ],
        resources: [
            { id: "R_1_MED1", scenarioId: "SCENARIO_1", nodeId: "N_1_DEPOT", type: "Medical", quantity: 350, weight: 6, value: 120 },
            { id: "R_1_FOOD1", scenarioId: "SCENARIO_1", nodeId: "N_1_DEPOT", type: "Food", quantity: 1200, weight: 15, value: 75 },
            { id: "R_1_WAT1", scenarioId: "SCENARIO_1", nodeId: "N_1_DEPOT", type: "Water", quantity: 1800, weight: 20, value: 85 },
            { id: "R_1_FUEL1", scenarioId: "SCENARIO_1", nodeId: "N_1_DEPOT", type: "Fuel", quantity: 400, weight: 18, value: 90 },
            { id: "R_1_MED2", scenarioId: "SCENARIO_1", nodeId: "N_1_HOSP2", type: "Medical", quantity: 180, weight: 5, value: 110 }
        ],
        demands: [
            { id: "D_1_1", scenarioId: "SCENARIO_1", nodeId: "N_1_HOSP1", population: 1450, foodReq: 300, waterReq: 500, medicalReq: 250, priority: 1, deadline: 1776100000000, status: "Pending" },
            { id: "D_1_2", scenarioId: "SCENARIO_1", nodeId: "N_1_SHEL1", population: 2800, foodReq: 800, waterReq: 1200, medicalReq: 140, priority: 1, deadline: 1776105000000, status: "Pending" },
            { id: "D_1_3", scenarioId: "SCENARIO_1", nodeId: "N_1_SHEL2", population: 1850, foodReq: 550, waterReq: 850, medicalReq: 110, priority: 2, deadline: 1776110000000, status: "Pending" },
            { id: "D_1_4", scenarioId: "SCENARIO_1", nodeId: "N_1_SHEL3", population: 1600, foodReq: 450, waterReq: 700, medicalReq: 90, priority: 3, deadline: 1776115000000, status: "Pending" },
            { id: "D_1_5", scenarioId: "SCENARIO_1", nodeId: "N_1_SHEL4", population: 980, foodReq: 280, waterReq: 450, medicalReq: 60, priority: 4, deadline: 1776120000000, status: "Pending" }
        ]
    },
    {
        id: "SCENARIO_2",
        name: "Pokhara Flash Flood & Dam Outburst",
        category: "Flood",
        severity: "HIGH",
        location: "Kaski District, Gandaki Province",
        description: "Torrential monsoon cloudburst triggering Seti River surging and localized flooding near Pokhara basin.",
        centerLat: 28.2096,
        centerLng: 83.9856,
        nodes: [
            { id: "N_2_DEPOT", scenarioId: "SCENARIO_2", name: "Pokhara Regional Logistics Depot", type: "Depot", lat: 28.2009, lng: 83.9820, capacity: 4200, availableResources: 2100, priority: 1 },
            { id: "N_2_HOSP", scenarioId: "SCENARIO_2", name: "Western Regional Hospital", type: "Hospital", lat: 28.2185, lng: 83.9912, capacity: 1100, availableResources: 320, priority: 1 },
            { id: "N_2_SHEL1", scenarioId: "SCENARIO_2", name: "Lakeside Tourist Camp Shelter", type: "Shelter", lat: 28.2120, lng: 83.9580, capacity: 2200, availableResources: 110, priority: 1 },
            { id: "N_2_SHEL2", scenarioId: "SCENARIO_2", name: "Hemja Flood Evac Shelter", type: "Shelter", lat: 28.2710, lng: 83.9350, capacity: 1900, availableResources: 75, priority: 2 },
            { id: "N_2_SHEL3", scenarioId: "SCENARIO_2", name: "Begnas Highland Refuge", type: "Shelter", lat: 28.1680, lng: 84.0950, capacity: 1300, availableResources: 50, priority: 3 }
        ],
        edges: [
            { id: "E_2_1", scenarioId: "SCENARIO_2", sourceId: "N_2_DEPOT", destId: "N_2_HOSP", distance: 4.2, travelTime: 14.0, capacity: 200, riskLevel: 2, disruptionProb: 0.18, status: "Open" },
            { id: "E_2_2", scenarioId: "SCENARIO_2", sourceId: "N_2_HOSP", destId: "N_2_SHEL1", distance: 5.8, travelTime: 20.0, capacity: 180, riskLevel: 3, disruptionProb: 0.45, status: "Blocked" },
            { id: "E_2_3", scenarioId: "SCENARIO_2", sourceId: "N_2_DEPOT", destId: "N_2_SHEL1", distance: 4.9, travelTime: 18.0, capacity: 160, riskLevel: 2, disruptionProb: 0.20, status: "Open" },
            { id: "E_2_4", scenarioId: "SCENARIO_2", sourceId: "N_2_HOSP", destId: "N_2_SHEL2", distance: 8.5, travelTime: 28.0, capacity: 140, riskLevel: 3, disruptionProb: 0.35, status: "Open" },
            { id: "E_2_5", scenarioId: "SCENARIO_2", sourceId: "N_2_DEPOT", destId: "N_2_SHEL3", distance: 14.6, travelTime: 42.0, capacity: 150, riskLevel: 1, disruptionProb: 0.08, status: "Open" },
            { id: "E_2_6", scenarioId: "SCENARIO_2", sourceId: "N_2_SHEL2", destId: "N_2_SHEL1", distance: 7.2, travelTime: 25.0, capacity: 120, riskLevel: 2, disruptionProb: 0.22, status: "Open" }
        ],
        resources: [
            { id: "R_2_WAT", scenarioId: "SCENARIO_2", nodeId: "N_2_DEPOT", type: "Water", quantity: 2200, weight: 20, value: 95 },
            { id: "R_2_MED", scenarioId: "SCENARIO_2", nodeId: "N_2_DEPOT", type: "Medical", quantity: 280, weight: 6, value: 115 },
            { id: "R_2_FOOD", scenarioId: "SCENARIO_2", nodeId: "N_2_DEPOT", type: "Food", quantity: 950, weight: 14, value: 80 }
        ],
        demands: [
            { id: "D_2_1", scenarioId: "SCENARIO_2", nodeId: "N_2_HOSP", population: 850, foodReq: 180, waterReq: 400, medicalReq: 160, priority: 1, deadline: 1776100000000, status: "Pending" },
            { id: "D_2_2", scenarioId: "SCENARIO_2", nodeId: "N_2_SHEL1", population: 1700, foodReq: 480, waterReq: 900, medicalReq: 110, priority: 1, deadline: 1776108000000, status: "Pending" },
            { id: "D_2_3", scenarioId: "SCENARIO_2", nodeId: "N_2_SHEL2", population: 1400, foodReq: 400, waterReq: 750, medicalReq: 85, priority: 2, deadline: 1776115000000, status: "Pending" },
            { id: "D_2_4", scenarioId: "SCENARIO_2", nodeId: "N_2_SHEL3", population: 920, foodReq: 260, waterReq: 500, medicalReq: 50, priority: 3, deadline: 1776122000000, status: "Pending" }
        ]
    },
    {
        id: "SCENARIO_3",
        name: "Chitwan Landslide Highway Severance",
        category: "Landslide",
        severity: "HIGH",
        location: "Narayangarh-Mugling Highway Corridor",
        description: "Massive debris flow across critical mountain passes disconnecting central transport corridors.",
        centerLat: 27.6833,
        centerLng: 84.4333,
        nodes: [
            { id: "N_3_DEPOT", scenarioId: "SCENARIO_3", name: "Bharatpur Central Warehouse", type: "Depot", lat: 27.6800, lng: 84.4250, capacity: 3800, availableResources: 1900, priority: 1 },
            { id: "N_3_HOSP", scenarioId: "SCENARIO_3", name: "Chitwan Medical College", type: "Hospital", lat: 27.6950, lng: 84.4420, capacity: 950, availableResources: 280, priority: 1 },
            { id: "N_3_SHEL1", scenarioId: "SCENARIO_3", name: "Mugling Stranded Transit Camp", type: "Shelter", lat: 27.8600, lng: 84.5500, capacity: 2500, availableResources: 60, priority: 1 },
            { id: "N_3_SHEL2", scenarioId: "SCENARIO_3", name: "Sauraha Evacuation Center", type: "Shelter", lat: 27.5800, lng: 84.4900, capacity: 1600, availableResources: 70, priority: 2 },
            { id: "N_3_SHEL3", scenarioId: "SCENARIO_3", name: "Madi River Shelter", type: "Shelter", lat: 27.4500, lng: 84.3500, capacity: 1100, availableResources: 40, priority: 3 }
        ],
        edges: [
            { id: "E_3_1", scenarioId: "SCENARIO_3", sourceId: "N_3_DEPOT", destId: "N_3_HOSP", distance: 3.5, travelTime: 12.0, capacity: 220, riskLevel: 1, disruptionProb: 0.05, status: "Open" },
            { id: "E_3_2", scenarioId: "SCENARIO_3", sourceId: "N_3_HOSP", destId: "N_3_SHEL1", distance: 28.4, travelTime: 85.0, capacity: 90, riskLevel: 3, disruptionProb: 0.60, status: "Blocked" },
            { id: "E_3_3", scenarioId: "SCENARIO_3", sourceId: "N_3_DEPOT", destId: "N_3_SHEL2", distance: 16.2, travelTime: 38.0, capacity: 160, riskLevel: 1, disruptionProb: 0.12, status: "Open" },
            { id: "E_3_4", scenarioId: "SCENARIO_3", sourceId: "N_3_SHEL2", destId: "N_3_SHEL3", distance: 22.0, travelTime: 55.0, capacity: 110, riskLevel: 2, disruptionProb: 0.25, status: "Open" },
            { id: "E_3_5", scenarioId: "SCENARIO_3", sourceId: "N_3_DEPOT", destId: "N_3_SHEL3", distance: 31.0, travelTime: 75.0, capacity: 100, riskLevel: 2, disruptionProb: 0.20, status: "Open" }
        ],
        resources: [
            { id: "R_3_MED", scenarioId: "SCENARIO_3", nodeId: "N_3_DEPOT", type: "Medical", quantity: 240, weight: 6, value: 110 },
            { id: "R_3_FOOD", scenarioId: "SCENARIO_3", nodeId: "N_3_DEPOT", type: "Food", quantity: 800, weight: 15, value: 70 },
            { id: "R_3_WAT", scenarioId: "SCENARIO_3", nodeId: "N_3_DEPOT", type: "Water", quantity: 1500, weight: 20, value: 85 }
        ],
        demands: [
            { id: "D_3_1", scenarioId: "SCENARIO_3", nodeId: "N_3_SHEL1", population: 2100, foodReq: 600, waterReq: 900, medicalReq: 180, priority: 1, deadline: 1776102000000, status: "Pending" },
            { id: "D_3_2", scenarioId: "SCENARIO_3", nodeId: "N_3_HOSP", population: 700, foodReq: 150, waterReq: 300, medicalReq: 140, priority: 2, deadline: 1776109000000, status: "Pending" },
            { id: "D_3_3", scenarioId: "SCENARIO_3", nodeId: "N_3_SHEL2", population: 1200, foodReq: 320, waterReq: 580, medicalReq: 70, priority: 2, deadline: 1776118000000, status: "Pending" },
            { id: "D_3_4", scenarioId: "SCENARIO_3", nodeId: "N_3_SHEL3", population: 850, foodReq: 220, waterReq: 400, medicalReq: 50, priority: 3, deadline: 1776125000000, status: "Pending" }
        ]
    },
    {
        id: "SCENARIO_4",
        name: "Lalitpur Wildfire & Urban Periphery Blaze",
        category: "Wildfire",
        severity: "MODERATE",
        location: "Southern Lalitpur Hills",
        description: "Dry season wildland fire sweeping hill communities, creating smoke hazards and road closures.",
        centerLat: 27.6200,
        centerLng: 85.3300,
        nodes: [
            { id: "N_4_DEPOT", scenarioId: "SCENARIO_4", name: "Godawari Forest Operations Depot", type: "Depot", lat: 27.5950, lng: 85.3800, capacity: 3000, availableResources: 1400, priority: 1 },
            { id: "N_4_HOSP", scenarioId: "SCENARIO_4", name: "Patan Hospital Burn Center", type: "Hospital", lat: 27.6680, lng: 85.3220, capacity: 800, availableResources: 250, priority: 1 },
            { id: "N_4_SHEL1", scenarioId: "SCENARIO_4", name: "Chapagaun Evac Center", type: "Shelter", lat: 27.6050, lng: 85.3280, capacity: 1500, availableResources: 80, priority: 1 },
            { id: "N_4_SHEL2", scenarioId: "SCENARIO_4", name: "Lele Hill Evacuation Point", type: "Shelter", lat: 27.5600, lng: 85.3200, capacity: 1200, availableResources: 45, priority: 2 }
        ],
        edges: [
            { id: "E_4_1", scenarioId: "SCENARIO_4", sourceId: "N_4_DEPOT", destId: "N_4_HOSP", distance: 11.2, travelTime: 32.0, capacity: 160, riskLevel: 2, disruptionProb: 0.20, status: "Open" },
            { id: "E_4_2", scenarioId: "SCENARIO_4", sourceId: "N_4_DEPOT", destId: "N_4_SHEL1", distance: 6.4, travelTime: 18.0, capacity: 140, riskLevel: 3, disruptionProb: 0.40, status: "Open" },
            { id: "E_4_3", scenarioId: "SCENARIO_4", sourceId: "N_4_SHEL1", destId: "N_4_HOSP", distance: 8.6, travelTime: 24.0, capacity: 180, riskLevel: 1, disruptionProb: 0.10, status: "Open" },
            { id: "E_4_4", scenarioId: "SCENARIO_4", sourceId: "N_4_SHEL1", destId: "N_4_SHEL2", distance: 7.1, travelTime: 22.0, capacity: 110, riskLevel: 3, disruptionProb: 0.50, status: "Blocked" },
            { id: "E_4_5", scenarioId: "SCENARIO_4", sourceId: "N_4_DEPOT", destId: "N_4_SHEL2", distance: 13.8, travelTime: 42.0, capacity: 90, riskLevel: 3, disruptionProb: 0.35, status: "Open" }
        ],
        resources: [
            { id: "R_4_WAT", scenarioId: "SCENARIO_4", nodeId: "N_4_DEPOT", type: "Water", quantity: 1800, weight: 20, value: 100 },
            { id: "R_4_MED", scenarioId: "SCENARIO_4", nodeId: "N_4_DEPOT", type: "Medical", quantity: 220, weight: 5, value: 125 },
            { id: "R_4_FOOD", scenarioId: "SCENARIO_4", nodeId: "N_4_DEPOT", type: "Food", quantity: 600, weight: 12, value: 65 }
        ],
        demands: [
            { id: "D_4_1", scenarioId: "SCENARIO_4", nodeId: "N_4_SHEL1", population: 1300, foodReq: 350, waterReq: 700, medicalReq: 90, priority: 1, deadline: 1776104000000, status: "Pending" },
            { id: "D_4_2", scenarioId: "SCENARIO_4", nodeId: "N_4_HOSP", population: 550, foodReq: 120, waterReq: 250, medicalReq: 110, priority: 1, deadline: 1776108000000, status: "Pending" },
            { id: "D_4_3", scenarioId: "SCENARIO_4", nodeId: "N_4_SHEL2", population: 900, foodReq: 240, waterReq: 500, medicalReq: 60, priority: 2, deadline: 1776116000000, status: "Pending" }
        ]
    },
    {
        id: "SCENARIO_5",
        name: "Bhaktapur Heritage City Building Collapse",
        category: "Earthquake",
        severity: "CRITICAL",
        location: "Bhaktapur District, Bagmati Province",
        description: "Dense ancient brick masonry collapse blocking narrow streets; urgent search and rescue underway.",
        centerLat: 27.6710,
        centerLng: 85.4298,
        nodes: [
            { id: "N_5_DEPOT", scenarioId: "SCENARIO_5", name: "Sallaghari Staging Area", type: "Depot", lat: 27.6750, lng: 85.4050, capacity: 3500, availableResources: 1800, priority: 1 },
            { id: "N_5_HOSP", scenarioId: "SCENARIO_5", name: "Bhaktapur Hospital", type: "Hospital", lat: 27.6720, lng: 85.4250, capacity: 900, availableResources: 260, priority: 1 },
            { id: "N_5_SHEL1", scenarioId: "SCENARIO_5", name: "Durbar Square Relief Point", type: "Shelter", lat: 27.6715, lng: 85.4285, capacity: 1800, availableResources: 90, priority: 1 },
            { id: "N_5_SHEL2", scenarioId: "SCENARIO_5", name: "Taumadhi Square Camp", type: "Shelter", lat: 27.6705, lng: 85.4320, capacity: 1400, availableResources: 50, priority: 2 },
            { id: "N_5_SHEL3", scenarioId: "SCENARIO_5", name: "Changunarayan Hill Shelter", type: "Shelter", lat: 27.7150, lng: 85.4270, capacity: 1100, availableResources: 40, priority: 3 }
        ],
        edges: [
            { id: "E_5_1", scenarioId: "SCENARIO_5", sourceId: "N_5_DEPOT", destId: "N_5_HOSP", distance: 2.3, travelTime: 9.0, capacity: 200, riskLevel: 2, disruptionProb: 0.15, status: "Open" },
            { id: "E_5_2", scenarioId: "SCENARIO_5", sourceId: "N_5_HOSP", destId: "N_5_SHEL1", distance: 0.8, travelTime: 5.0, capacity: 100, riskLevel: 3, disruptionProb: 0.50, status: "Blocked" },
            { id: "E_5_3", scenarioId: "SCENARIO_5", sourceId: "N_5_DEPOT", destId: "N_5_SHEL1", distance: 2.8, travelTime: 12.0, capacity: 150, riskLevel: 2, disruptionProb: 0.25, status: "Open" },
            { id: "E_5_4", scenarioId: "SCENARIO_5", sourceId: "N_5_SHEL1", destId: "N_5_SHEL2", distance: 0.6, travelTime: 4.0, capacity: 80, riskLevel: 3, disruptionProb: 0.45, status: "Open" },
            { id: "E_5_5", scenarioId: "SCENARIO_5", sourceId: "N_5_DEPOT", destId: "N_5_SHEL3", distance: 6.5, travelTime: 25.0, capacity: 120, riskLevel: 2, disruptionProb: 0.20, status: "Open" }
        ],
        resources: [
            { id: "R_5_MED", scenarioId: "SCENARIO_5", nodeId: "N_5_DEPOT", type: "Medical", quantity: 300, weight: 5, value: 130 },
            { id: "R_5_WAT", scenarioId: "SCENARIO_5", nodeId: "N_5_DEPOT", type: "Water", quantity: 1600, weight: 20, value: 85 },
            { id: "R_5_FOOD", scenarioId: "SCENARIO_5", nodeId: "N_5_DEPOT", type: "Food", quantity: 900, weight: 14, value: 75 }
        ],
        demands: [
            { id: "D_5_1", scenarioId: "SCENARIO_5", nodeId: "N_5_SHEL1", population: 1600, foodReq: 450, waterReq: 800, medicalReq: 130, priority: 1, deadline: 1776101000000, status: "Pending" },
            { id: "D_5_2", scenarioId: "SCENARIO_5", nodeId: "N_5_HOSP", population: 650, foodReq: 150, waterReq: 280, medicalReq: 140, priority: 1, deadline: 1776106000000, status: "Pending" },
            { id: "D_5_3", scenarioId: "SCENARIO_5", nodeId: "N_5_SHEL2", population: 1200, foodReq: 320, waterReq: 600, medicalReq: 80, priority: 2, deadline: 1776114000000, status: "Pending" },
            { id: "D_5_4", scenarioId: "SCENARIO_5", nodeId: "N_5_SHEL3", population: 800, foodReq: 210, waterReq: 400, medicalReq: 45, priority: 3, deadline: 1776122000000, status: "Pending" }
        ]
    },
    {
        id: "SCENARIO_6",
        name: "Everest Base Camp High-Altitude Avalanche",
        category: "Avalanche",
        severity: "CRITICAL",
        location: "Khumbu Region, Solukhumbu District",
        description: "Icefall collapse affecting mountaineers and Sherpa camps. Helicopter airlifts and mountain pass logistics.",
        centerLat: 28.0026,
        centerLng: 86.8528,
        nodes: [
            { id: "N_6_DEPOT", scenarioId: "SCENARIO_6", name: "Lukla Tenzing-Hillary Heli Hub", type: "Depot", lat: 27.6869, lng: 86.7290, capacity: 1800, availableResources: 900, priority: 1 },
            { id: "N_6_HOSP", scenarioId: "SCENARIO_6", name: "Khunde Mountain Hospital", type: "Hospital", lat: 27.8200, lng: 86.7150, capacity: 400, availableResources: 180, priority: 1 },
            { id: "N_6_SHEL1", scenarioId: "SCENARIO_6", name: "Namche Bazaar Staging Center", type: "Shelter", lat: 27.8069, lng: 86.7140, capacity: 1200, availableResources: 95, priority: 1 },
            { id: "N_6_SHEL2", scenarioId: "SCENARIO_6", name: "Pheriche Highland Aid Post", type: "Shelter", lat: 27.8920, lng: 86.8200, capacity: 600, availableResources: 50, priority: 1 },
            { id: "N_6_SHEL3", scenarioId: "SCENARIO_6", name: "Gorakshep Avalanche Shelter", type: "Shelter", lat: 27.9810, lng: 86.8290, capacity: 450, availableResources: 30, priority: 2 }
        ],
        edges: [
            { id: "E_6_1", scenarioId: "SCENARIO_6", sourceId: "N_6_DEPOT", destId: "N_6_SHEL1", distance: 13.5, travelTime: 50.0, capacity: 60, riskLevel: 2, disruptionProb: 0.15, status: "Open" },
            { id: "E_6_2", scenarioId: "SCENARIO_6", sourceId: "N_6_SHEL1", destId: "N_6_HOSP", distance: 2.1, travelTime: 15.0, capacity: 40, riskLevel: 1, disruptionProb: 0.05, status: "Open" },
            { id: "E_6_3", scenarioId: "SCENARIO_6", sourceId: "N_6_SHEL1", destId: "N_6_SHEL2", distance: 14.8, travelTime: 70.0, capacity: 35, riskLevel: 3, disruptionProb: 0.40, status: "Open" },
            { id: "E_6_4", scenarioId: "SCENARIO_6", sourceId: "N_6_SHEL2", destId: "N_6_SHEL3", distance: 9.2, travelTime: 55.0, capacity: 25, riskLevel: 3, disruptionProb: 0.65, status: "Blocked" },
            { id: "E_6_5", scenarioId: "SCENARIO_6", sourceId: "N_6_DEPOT", destId: "N_6_SHEL2", distance: 25.0, travelTime: 110.0, capacity: 30, riskLevel: 3, disruptionProb: 0.35, status: "Open" },
            { id: "E_6_6", scenarioId: "SCENARIO_6", sourceId: "N_6_DEPOT", destId: "N_6_SHEL3", distance: 29.5, travelTime: 120.0, capacity: 20, riskLevel: 3, disruptionProb: 0.45, status: "Open" }
        ],
        resources: [
            { id: "R_6_MED", scenarioId: "SCENARIO_6", nodeId: "N_6_DEPOT", type: "Medical", quantity: 180, weight: 4, value: 160 },
            { id: "R_6_FOOD", scenarioId: "SCENARIO_6", nodeId: "N_6_DEPOT", type: "Food", quantity: 450, weight: 8, value: 95 },
            { id: "R_6_FUEL", scenarioId: "SCENARIO_6", nodeId: "N_6_DEPOT", type: "Fuel", quantity: 300, weight: 12, value: 120 }
        ],
        demands: [
            { id: "D_6_1", scenarioId: "SCENARIO_6", nodeId: "N_6_SHEL3", population: 350, foodReq: 120, waterReq: 150, medicalReq: 90, priority: 1, deadline: 1776098000000, status: "Pending" },
            { id: "D_6_2", scenarioId: "SCENARIO_6", nodeId: "N_6_SHEL2", population: 480, foodReq: 150, waterReq: 200, medicalReq: 75, priority: 1, deadline: 1776103000000, status: "Pending" },
            { id: "D_6_3", scenarioId: "SCENARIO_6", nodeId: "N_6_HOSP", population: 220, foodReq: 70, waterReq: 100, medicalReq: 60, priority: 2, deadline: 1776110000000, status: "Pending" }
        ]
    },
    {
        id: "SCENARIO_7",
        name: "Annapurna Mountain Circuit Blizzard",
        category: "Blizzard",
        severity: "HIGH",
        location: "Thorong La Pass, Manang & Mustang",
        description: "Zero-visibility whiteout storm with subzero temperatures trapping trekkers across mountain ridges.",
        centerLat: 28.7900,
        centerLng: 83.9300,
        nodes: [
            { id: "N_7_DEPOT", scenarioId: "SCENARIO_7", name: "Jomsom Airport Depot", type: "Depot", lat: 28.7810, lng: 83.7230, capacity: 2200, availableResources: 1100, priority: 1 },
            { id: "N_7_HOSP", scenarioId: "SCENARIO_7", name: "Jomsom District Hospital", type: "Hospital", lat: 28.7840, lng: 83.7280, capacity: 500, availableResources: 190, priority: 1 },
            { id: "N_7_SHEL1", scenarioId: "SCENARIO_7", name: "Muktinath Pilgrim Shelter", type: "Shelter", lat: 28.8170, lng: 83.8710, capacity: 1100, availableResources: 70, priority: 1 },
            { id: "N_7_SHEL2", scenarioId: "SCENARIO_7", name: "Thorong Phedi High Camp", type: "Shelter", lat: 28.7990, lng: 83.9720, capacity: 550, availableResources: 35, priority: 1 }
        ],
        edges: [
            { id: "E_7_1", scenarioId: "SCENARIO_7", sourceId: "N_7_DEPOT", destId: "N_7_HOSP", distance: 1.5, travelTime: 8.0, capacity: 80, riskLevel: 1, disruptionProb: 0.10, status: "Open" },
            { id: "E_7_2", scenarioId: "SCENARIO_7", sourceId: "N_7_HOSP", destId: "N_7_SHEL1", distance: 18.0, travelTime: 65.0, capacity: 40, riskLevel: 2, disruptionProb: 0.30, status: "Open" },
            { id: "E_7_3", scenarioId: "SCENARIO_7", sourceId: "N_7_SHEL1", destId: "N_7_SHEL2", distance: 12.0, travelTime: 80.0, capacity: 25, riskLevel: 3, disruptionProb: 0.60, status: "Blocked" },
            { id: "E_7_4", scenarioId: "SCENARIO_7", sourceId: "N_7_DEPOT", destId: "N_7_SHEL1", distance: 19.2, travelTime: 70.0, capacity: 45, riskLevel: 2, disruptionProb: 0.25, status: "Open" },
            { id: "E_7_5", scenarioId: "SCENARIO_7", sourceId: "N_7_DEPOT", destId: "N_7_SHEL2", distance: 28.5, travelTime: 110.0, capacity: 20, riskLevel: 3, disruptionProb: 0.50, status: "Open" }
        ],
        resources: [
            { id: "R_7_MED", scenarioId: "SCENARIO_7", nodeId: "N_7_DEPOT", type: "Medical", quantity: 150, weight: 4, value: 140 },
            { id: "R_7_FOOD", scenarioId: "SCENARIO_7", nodeId: "N_7_DEPOT", type: "Food", quantity: 500, weight: 10, value: 85 },
            { id: "R_7_FUEL", scenarioId: "SCENARIO_7", nodeId: "N_7_DEPOT", type: "Fuel", quantity: 400, weight: 15, value: 110 }
        ],
        demands: [
            { id: "D_7_1", scenarioId: "SCENARIO_7", nodeId: "N_7_SHEL2", population: 420, foodReq: 130, waterReq: 180, medicalReq: 80, priority: 1, deadline: 1776099000000, status: "Pending" },
            { id: "D_7_2", scenarioId: "SCENARIO_7", nodeId: "N_7_SHEL1", population: 850, foodReq: 240, waterReq: 350, medicalReq: 70, priority: 2, deadline: 1776108000000, status: "Pending" }
        ]
    },
    {
        id: "SCENARIO_8",
        name: "Lumbini Terai Heatwave & Water Depletion",
        category: "Heatwave",
        severity: "HIGH",
        location: "Rupandehi District, Lumbini Province",
        description: "Extreme 45°C temperatures drying local aquifers, critical hydration and medical heatstroke response.",
        centerLat: 27.4800,
        centerLng: 83.2750,
        nodes: [
            { id: "N_8_DEPOT", scenarioId: "SCENARIO_8", name: "Bhairahawa Cargo Hub", type: "Depot", lat: 27.5050, lng: 83.4500, capacity: 4800, availableResources: 2400, priority: 1 },
            { id: "N_8_HOSP", scenarioId: "SCENARIO_8", name: "Bhim Hospital Trauma Wing", type: "Hospital", lat: 27.5020, lng: 83.4530, capacity: 1000, availableResources: 300, priority: 1 },
            { id: "N_8_SHEL1", scenarioId: "SCENARIO_8", name: "Lumbini Sacred Garden Relief Camp", type: "Shelter", lat: 27.4800, lng: 83.2750, capacity: 2800, availableResources: 150, priority: 1 },
            { id: "N_8_SHEL2", scenarioId: "SCENARIO_8", name: "Butwal Municipal Center", type: "Shelter", lat: 27.7000, lng: 83.4600, capacity: 2400, availableResources: 120, priority: 2 }
        ],
        edges: [
            { id: "E_8_1", scenarioId: "SCENARIO_8", sourceId: "N_8_DEPOT", destId: "N_8_HOSP", distance: 1.8, travelTime: 6.0, capacity: 260, riskLevel: 1, disruptionProb: 0.05, status: "Open" },
            { id: "E_8_2", scenarioId: "SCENARIO_8", sourceId: "N_8_DEPOT", destId: "N_8_SHEL1", distance: 22.5, travelTime: 45.0, capacity: 180, riskLevel: 1, disruptionProb: 0.10, status: "Open" },
            { id: "E_8_3", scenarioId: "SCENARIO_8", sourceId: "N_8_DEPOT", destId: "N_8_SHEL2", distance: 21.0, travelTime: 40.0, capacity: 210, riskLevel: 1, disruptionProb: 0.08, status: "Open" },
            { id: "E_8_4", scenarioId: "SCENARIO_8", sourceId: "N_8_SHEL1", destId: "N_8_SHEL2", distance: 34.0, travelTime: 70.0, capacity: 150, riskLevel: 2, disruptionProb: 0.15, status: "Open" }
        ],
        resources: [
            { id: "R_8_WAT", scenarioId: "SCENARIO_8", nodeId: "N_8_DEPOT", type: "Water", quantity: 3500, weight: 20, value: 110 },
            { id: "R_8_MED", scenarioId: "SCENARIO_8", nodeId: "N_8_DEPOT", type: "Medical", quantity: 300, weight: 5, value: 120 },
            { id: "R_8_FOOD", scenarioId: "SCENARIO_8", nodeId: "N_8_DEPOT", type: "Food", quantity: 800, weight: 12, value: 60 }
        ],
        demands: [
            { id: "D_8_1", scenarioId: "SCENARIO_8", nodeId: "N_8_SHEL1", population: 2500, foodReq: 400, waterReq: 1800, medicalReq: 140, priority: 1, deadline: 1776100000000, status: "Pending" },
            { id: "D_8_2", scenarioId: "SCENARIO_8", nodeId: "N_8_SHEL2", population: 2100, foodReq: 350, waterReq: 1400, medicalReq: 100, priority: 2, deadline: 1776110000000, status: "Pending" },
            { id: "D_8_3", scenarioId: "SCENARIO_8", nodeId: "N_8_HOSP", population: 800, foodReq: 140, waterReq: 500, medicalReq: 150, priority: 1, deadline: 1776103000000, status: "Pending" }
        ]
    },
    {
        id: "SCENARIO_9",
        name: "Dharan Tropical Thunderstorm & Urban Grid Damage",
        category: "Storm",
        severity: "MODERATE",
        location: "Sunsari District, Koshi Province",
        description: "Severe squall with downed high-voltage lines, localized tree falls, and flash flooding in low-lying sectors.",
        centerLat: 26.8120,
        centerLng: 87.2830,
        nodes: [
            { id: "N_9_DEPOT", scenarioId: "SCENARIO_9", name: "Itahari Logistics Hub", type: "Depot", lat: 26.6650, lng: 87.2750, capacity: 4000, availableResources: 2000, priority: 1 },
            { id: "N_9_HOSP", scenarioId: "SCENARIO_9", name: "BPKIHS University Hospital", type: "Hospital", lat: 26.8150, lng: 87.2900, capacity: 1400, availableResources: 480, priority: 1 },
            { id: "N_9_SHEL1", scenarioId: "SCENARIO_9", name: "Dharan Clock Tower Shelter", type: "Shelter", lat: 26.8100, lng: 87.2800, capacity: 1900, availableResources: 100, priority: 1 },
            { id: "N_9_SHEL2", scenarioId: "SCENARIO_9", name: "Chatara Riverbank Camp", type: "Shelter", lat: 26.8200, lng: 87.1500, capacity: 1300, availableResources: 60, priority: 2 }
        ],
        edges: [
            { id: "E_9_1", scenarioId: "SCENARIO_9", sourceId: "N_9_DEPOT", destId: "N_9_HOSP", distance: 17.5, travelTime: 35.0, capacity: 220, riskLevel: 2, disruptionProb: 0.15, status: "Open" },
            { id: "E_9_2", scenarioId: "SCENARIO_9", sourceId: "N_9_HOSP", destId: "N_9_SHEL1", distance: 1.8, travelTime: 8.0, capacity: 180, riskLevel: 1, disruptionProb: 0.10, status: "Open" },
            { id: "E_9_3", scenarioId: "SCENARIO_9", sourceId: "N_9_SHEL1", destId: "N_9_SHEL2", distance: 14.0, travelTime: 40.0, capacity: 120, riskLevel: 3, disruptionProb: 0.40, status: "Blocked" },
            { id: "E_9_4", scenarioId: "SCENARIO_9", sourceId: "N_9_DEPOT", destId: "N_9_SHEL2", distance: 24.0, travelTime: 55.0, capacity: 140, riskLevel: 2, disruptionProb: 0.20, status: "Open" }
        ],
        resources: [
            { id: "R_9_MED", scenarioId: "SCENARIO_9", nodeId: "N_9_DEPOT", type: "Medical", quantity: 260, weight: 5, value: 110 },
            { id: "R_9_WAT", scenarioId: "SCENARIO_9", nodeId: "N_9_DEPOT", type: "Water", quantity: 1800, weight: 20, value: 90 },
            { id: "R_9_FOOD", scenarioId: "SCENARIO_9", nodeId: "N_9_DEPOT", type: "Food", quantity: 950, weight: 14, value: 70 }
        ],
        demands: [
            { id: "D_9_1", scenarioId: "SCENARIO_9", nodeId: "N_9_HOSP", population: 950, foodReq: 220, waterReq: 450, medicalReq: 160, priority: 1, deadline: 1776102000000, status: "Pending" },
            { id: "D_9_2", scenarioId: "SCENARIO_9", nodeId: "N_9_SHEL1", population: 1600, foodReq: 420, waterReq: 800, medicalReq: 90, priority: 2, deadline: 1776110000000, status: "Pending" },
            { id: "D_9_3", scenarioId: "SCENARIO_9", nodeId: "N_9_SHEL2", population: 1100, foodReq: 280, waterReq: 550, medicalReq: 60, priority: 2, deadline: 1776118000000, status: "Pending" }
        ]
    },
    {
        id: "SCENARIO_10",
        name: "Janakpur Post-Flood Waterborne Epidemic",
        category: "Epidemic",
        severity: "CRITICAL",
        location: "Dhanusha District, Madhesh Province",
        description: "Acute water contamination outbreak requiring mass distribution of oral rehydration salts, IV fluids, and mobile quarantine camps.",
        centerLat: 26.7288,
        centerLng: 85.9244,
        nodes: [
            { id: "N_10_DEPOT", scenarioId: "SCENARIO_10", name: "Janakpur Airport Depot", type: "Depot", lat: 26.7050, lng: 85.9200, capacity: 4500, availableResources: 2300, priority: 1 },
            { id: "N_10_HOSP", scenarioId: "SCENARIO_10", name: "Janakpur Zonal Hospital", type: "Hospital", lat: 26.7320, lng: 85.9300, capacity: 1300, availableResources: 420, priority: 1 },
            { id: "N_10_SHEL1", scenarioId: "SCENARIO_10", name: "Janaki Mandir Quarantine Shelter", type: "Shelter", lat: 26.7290, lng: 85.9240, capacity: 2600, availableResources: 110, priority: 1 },
            { id: "N_10_SHEL2", scenarioId: "SCENARIO_10", name: "Dhanushadham Rural Isolation Center", type: "Shelter", lat: 26.8300, lng: 86.0500, capacity: 1500, availableResources: 65, priority: 2 }
        ],
        edges: [
            { id: "E_10_1", scenarioId: "SCENARIO_10", sourceId: "N_10_DEPOT", destId: "N_10_HOSP", distance: 3.8, travelTime: 14.0, capacity: 200, riskLevel: 1, disruptionProb: 0.10, status: "Open" },
            { id: "E_10_2", scenarioId: "SCENARIO_10", sourceId: "N_10_HOSP", destId: "N_10_SHEL1", distance: 1.2, travelTime: 6.0, capacity: 160, riskLevel: 2, disruptionProb: 0.20, status: "Open" },
            { id: "E_10_3", scenarioId: "SCENARIO_10", sourceId: "N_10_DEPOT", destId: "N_10_SHEL1", distance: 3.2, travelTime: 12.0, capacity: 180, riskLevel: 1, disruptionProb: 0.12, status: "Open" },
            { id: "E_10_4", scenarioId: "SCENARIO_10", sourceId: "N_10_HOSP", destId: "N_10_SHEL2", distance: 18.5, travelTime: 48.0, capacity: 110, riskLevel: 3, disruptionProb: 0.45, status: "Blocked" },
            { id: "E_10_5", scenarioId: "SCENARIO_10", sourceId: "N_10_DEPOT", destId: "N_10_SHEL2", distance: 20.0, travelTime: 52.0, capacity: 120, riskLevel: 2, disruptionProb: 0.25, status: "Open" }
        ],
        resources: [
            { id: "R_10_MED", scenarioId: "SCENARIO_10", nodeId: "N_10_DEPOT", type: "Medical", quantity: 600, weight: 4, value: 150 },
            { id: "R_10_WAT", scenarioId: "SCENARIO_10", nodeId: "N_10_DEPOT", type: "Water", quantity: 2800, weight: 20, value: 105 },
            { id: "R_10_FOOD", scenarioId: "SCENARIO_10", nodeId: "N_10_DEPOT", type: "Food", quantity: 850, weight: 12, value: 65 }
        ],
        demands: [
            { id: "D_10_1", scenarioId: "SCENARIO_10", nodeId: "N_10_HOSP", population: 1200, foodReq: 260, waterReq: 700, medicalReq: 320, priority: 1, deadline: 1776097000000, status: "Pending" },
            { id: "D_10_2", scenarioId: "SCENARIO_10", nodeId: "N_10_SHEL1", population: 2400, foodReq: 600, waterReq: 1600, medicalReq: 240, priority: 1, deadline: 1776104000000, status: "Pending" },
            { id: "D_10_3", scenarioId: "SCENARIO_10", nodeId: "N_10_SHEL2", population: 1400, foodReq: 380, waterReq: 900, medicalReq: 140, priority: 2, deadline: 1776115000000, status: "Pending" }
        ]
    }
];
