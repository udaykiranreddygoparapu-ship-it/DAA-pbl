/**
 * Greedy Multi-Commodity Resource Rationing Algorithm
 * DAA Project - Disaster Response Logistics
 * Time Complexity: O(D log D + D * R)
 * Space Complexity: O(R)
 */

export class GreedyAlgorithm {
    /**
     * Allocates finite relief supplies across competing shelter demands greedily by priority.
     * @param {Array} demands - Shelter demand requests { id, nodeId, priority, foodReq, waterReq, medicalReq, population, ... }
     * @param {Array} resources - Available depot resources { id, nodeId, type, quantity, ... }
     * @returns {Object} Allocation summary and records
     */
    static allocateResources(demands, resources) {
        const steps = [];
        if (!demands || demands.length === 0 || !resources || resources.length === 0) {
            return {
                allocations: [],
                shelterFulfillment: [],
                commodityStats: { food: { req: 0, alloc: 0 }, water: { req: 0, alloc: 0 }, medical: { req: 0, alloc: 0 } },
                overallSatisfactionPercent: 0,
                steps: ["No demands or resources present for allocation."]
            };
        }

        // Sort demands by urgency: lower priority integer represents higher urgency (Priority 1 = Critical Triage)
        const sortedDemands = [...demands].sort((a, b) => a.priority - b.priority);
        steps.push(`Sorted ${demands.length} shelter demands in descending urgency (Priority 1 highest).`);

        // Mutable inventory pools
        const resourcePool = new Map();
        resources.forEach(r => {
            resourcePool.set(r.id, r.quantity || 0);
        });

        const allocations = [];
        const shelterMap = new Map();

        // Track global requests vs allocations
        let totalFoodReq = 0, totalWaterReq = 0, totalMedicalReq = 0;
        let totalFoodAlloc = 0, totalWaterAlloc = 0, totalMedicalAlloc = 0;

        sortedDemands.forEach(d => {
            totalFoodReq += d.foodReq || 0;
            totalWaterReq += d.waterReq || 0;
            totalMedicalReq += d.medicalReq || 0;

            let remainingFood = d.foodReq || 0;
            let remainingWater = d.waterReq || 0;
            let remainingMed = d.medicalReq || 0;

            let allocatedFood = 0;
            let allocatedWater = 0;
            let allocatedMed = 0;

            for (const res of resources) {
                const stock = resourcePool.get(res.id) || 0;
                if (stock <= 0) continue;

                if (res.type === 'Food' && remainingFood > 0) {
                    const take = Math.min(remainingFood, stock);
                    allocations.push({ demandId: d.id, nodeId: d.nodeId, resourceId: res.id, type: 'Food', amount: take, priority: d.priority });
                    remainingFood -= take;
                    allocatedFood += take;
                    totalFoodAlloc += take;
                    resourcePool.set(res.id, stock - take);
                } else if (res.type === 'Water' && remainingWater > 0) {
                    const take = Math.min(remainingWater, stock);
                    allocations.push({ demandId: d.id, nodeId: d.nodeId, resourceId: res.id, type: 'Water', amount: take, priority: d.priority });
                    remainingWater -= take;
                    allocatedWater += take;
                    totalWaterAlloc += take;
                    resourcePool.set(res.id, stock - take);
                } else if (res.type === 'Medical' && remainingMed > 0) {
                    const take = Math.min(remainingMed, stock);
                    allocations.push({ demandId: d.id, nodeId: d.nodeId, resourceId: res.id, type: 'Medical', amount: take, priority: d.priority });
                    remainingMed -= take;
                    allocatedMed += take;
                    totalMedicalAlloc += take;
                    resourcePool.set(res.id, stock - take);
                }
            }

            const totalReq = (d.foodReq || 0) + (d.waterReq || 0) + (d.medicalReq || 0);
            const totalAlloc = allocatedFood + allocatedWater + allocatedMed;
            const satisfaction = totalReq > 0 ? (totalAlloc / totalReq) * 100 : 100;

            shelterMap.set(d.id, {
                demandId: d.id,
                nodeId: d.nodeId,
                priority: d.priority,
                population: d.population,
                food: { requested: d.foodReq, allocated: allocatedFood },
                water: { requested: d.waterReq, allocated: allocatedWater },
                medical: { requested: d.medicalReq, allocated: allocatedMed },
                totalRequested: totalReq,
                totalAllocated: totalAlloc,
                satisfactionPercent: Math.round(satisfaction * 10) / 10
            });

            steps.push(`Shelter [${d.nodeId}] (Priority ${d.priority}): Allocated Food=${allocatedFood}/${d.foodReq}, Water=${allocatedWater}/${d.waterReq}, Medical=${allocatedMed}/${d.medicalReq} (${satisfaction.toFixed(1)}% fulfilled).`);
        });

        const grandTotalReq = totalFoodReq + totalWaterReq + totalMedicalReq;
        const grandTotalAlloc = totalFoodAlloc + totalWaterAlloc + totalMedicalAlloc;
        const overallSatisfactionPercent = grandTotalReq > 0 ? Math.round((grandTotalAlloc / grandTotalReq) * 1000) / 10 : 100;

        return {
            allocations,
            shelterFulfillment: Array.from(shelterMap.values()),
            commodityStats: {
                food: { req: totalFoodReq, alloc: totalFoodAlloc, pct: totalFoodReq > 0 ? Math.round((totalFoodAlloc / totalFoodReq) * 100) : 100 },
                water: { req: totalWaterReq, alloc: totalWaterAlloc, pct: totalWaterReq > 0 ? Math.round((totalWaterAlloc / totalWaterReq) * 100) : 100 },
                medical: { req: totalMedicalReq, alloc: totalMedicalAlloc, pct: totalMedicalReq > 0 ? Math.round((totalMedicalAlloc / totalMedicalReq) * 100) : 100 }
            },
            grandTotalReq,
            grandTotalAlloc,
            overallSatisfactionPercent,
            steps
        };
    }
}
