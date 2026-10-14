/**
 * 0/1 Knapsack Problem for Emergency Relief Payload Packing
 * DAA Project - Disaster Response Logistics
 * Time Complexity: O(N * W)
 * Space Complexity: O(N * W)
 */

export class KnapsackAlgorithm {
    /**
     * Solves 0/1 Knapsack problem for emergency vehicle payload optimization.
     * @param {number} capacity - Maximum cargo weight capacity (e.g., kg or metric units)
     * @param {Array} resources - Available resource packages { id, type, weight, value, quantity, ... }
     * @returns {Object} { maxValue: number, totalWeight: number, selectedResources: Array, dpTablePreview: Array, efficiency: number, steps: Array<string> }
     */
    static solve(capacity, resources) {
        const steps = [];
        const cap = Math.max(0, Math.floor(capacity));

        if (!resources || resources.length === 0 || cap <= 0) {
            return {
                maxValue: 0,
                totalWeight: 0,
                selectedResources: [],
                dpTablePreview: [],
                efficiency: 0,
                steps: ["No resources or zero vehicle payload capacity."]
            };
        }

        // Flatten multi-quantity resource items into individual load units if quantity > 1
        // or treat each resource batch as discrete items
        const items = [];
        resources.forEach(r => {
            const count = Math.min(r.quantity || 1, 10); // cap individual batch units for crisp DP sizing
            for (let k = 0; k < count; k++) {
                items.push({
                    id: `${r.id}_${k+1}`,
                    parentResourceId: r.id,
                    type: r.type,
                    nodeId: r.nodeId,
                    weight: Math.max(1, r.weight || 1),
                    value: Math.max(1, r.value || 1)
                });
            }
        });

        const n = items.length;
        steps.push(`Prepared ${n} discrete relief cargo batches for payload ceiling ${cap} units.`);

        // Build 2D DP Table: dp[i][c]
        const dp = Array.from({ length: n + 1 }, () => new Int32Array(cap + 1));

        for (let i = 1; i <= n; i++) {
            const item = items[i - 1];
            const w = item.weight;
            const v = item.value;

            for (let c = 0; c <= cap; c++) {
                if (w <= c) {
                    dp[i][c] = Math.max(dp[i - 1][c], dp[i - 1][c - w] + v);
                } else {
                    dp[i][c] = dp[i - 1][c];
                }
            }
        }

        const maxValue = dp[n][cap];
        steps.push(`Computed maximum life-saving utility value: ${maxValue}.`);

        // Backtracking to find selected relief packages
        const selected = [];
        let res = maxValue;
        let wRemaining = cap;

        for (let i = n; i >= 1; i--) {
            if (res <= 0) break;
            if (res === dp[i - 1][wRemaining]) {
                continue; // Item not included
            } else {
                const chosen = items[i - 1];
                selected.push(chosen);
                res -= chosen.value;
                wRemaining -= chosen.weight;
                steps.push(`Selected package [${chosen.type}] (Weight: ${chosen.weight}, Utility: ${chosen.value}). Remaining cap: ${wRemaining}`);
            }
        }

        const totalWeight = selected.reduce((acc, it) => acc + it.weight, 0);
        const efficiency = cap > 0 ? Math.round((totalWeight / cap) * 100) : 0;

        // DP Table small sample for visualization (e.g. up to 6 items and sample weights)
        const sampleColStep = Math.max(1, Math.floor(cap / 8));
        const sampleCols = [];
        for (let c = 0; c <= cap; c += sampleColStep) {
            sampleCols.push(c);
        }
        if (!sampleCols.includes(cap)) sampleCols.push(cap);

        const dpTablePreview = {
            sampleCols,
            rows: items.slice(0, 8).map((it, idx) => ({
                itemLabel: `${it.type} (w:${it.weight}, v:${it.value})`,
                values: sampleCols.map(c => dp[idx + 1][c])
            }))
        };

        return {
            maxValue,
            totalWeight,
            selectedResources: selected,
            dpTablePreview,
            efficiency,
            steps
        };
    }
}
