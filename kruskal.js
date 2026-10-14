/**
 * Kruskal's Algorithm for Minimum Cost Road Reconnection (MST)
 * DAA Project - Disaster Response Logistics
 * Time Complexity: O(E log E) or O(E log V)
 * Space Complexity: O(V + E)
 */

class DisjointSet {
    constructor(nodes) {
        this.parent = new Map();
        this.rank = new Map();

        nodes.forEach(node => {
            this.parent.set(node.id, node.id);
            this.rank.set(node.id, 0);
        });
    }

    find(item) {
        if (this.parent.get(item) === item) {
            return item;
        }
        // Path Compression
        const res = this.find(this.parent.get(item));
        this.parent.set(item, res);
        return res;
    }

    union(set1, set2) {
        const root1 = this.find(set1);
        const root2 = this.find(set2);

        if (root1 === root2) return false; // Cycle detected

        const rank1 = this.rank.get(root1) || 0;
        const rank2 = this.rank.get(root2) || 0;

        if (rank1 > rank2) {
            this.parent.set(root2, root1);
        } else if (rank1 < rank2) {
            this.parent.set(root1, root2);
        } else {
            this.parent.set(root2, root1);
            this.rank.set(root1, rank1 + 1);
        }

        return true;
    }
}

export class KruskalAlgorithm {
    /**
     * Computes the Minimum Spanning Tree of the road network using Kruskal's greedy approach.
     * @param {Array} nodes - All nodes in network
     * @param {Array} edges - All edges in network
     * @returns {Object} { mstEdges: Array, totalDistance: number, totalTravelTime: number, steps: Array<string>, isFullyConnected: boolean }
     */
    static findMinimumSpanningTree(nodes, edges) {
        const steps = [];
        if (!nodes || nodes.length === 0) {
            return { mstEdges: [], totalDistance: 0, totalTravelTime: 0, steps: ["No nodes available."], isFullyConnected: false };
        }

        steps.push(`Starting Kruskal's MST on ${nodes.length} nodes and ${edges.length} total corridor segments.`);

        // Deduplicate undirected edges for clean MST computation (u-v and v-u)
        const uniqueEdgeMap = new Map();
        edges.forEach(e => {
            if (e.status === 'Blocked') return; // Skip blocked corridors
            const pairKey = [e.sourceId, e.destId].sort().join('--');
            if (!uniqueEdgeMap.has(pairKey) || uniqueEdgeMap.get(pairKey).distance > e.distance) {
                uniqueEdgeMap.set(pairKey, e);
            }
        });

        const sortedEdges = Array.from(uniqueEdgeMap.values()).sort((a, b) => a.distance - b.distance);
        steps.push(`Identified ${sortedEdges.length} valid unblocked corridors. Sorted by length.`);

        const dsu = new DisjointSet(nodes);
        const mst = [];
        let totalDistance = 0;
        let totalTravelTime = 0;

        for (const edge of sortedEdges) {
            const added = dsu.union(edge.sourceId, edge.destId);
            if (added) {
                mst.push(edge);
                totalDistance += edge.distance;
                totalTravelTime += (edge.travelTime || 0);
                steps.push(`Accepted corridor [${edge.sourceId} ↔ ${edge.destId}] (${edge.distance} km) - No cycle formed.`);
                if (mst.length === nodes.length - 1) {
                    steps.push(`MST backbone complete with ${mst.length} corridors connecting ${nodes.length} nodes.`);
                    break;
                }
            } else {
                steps.push(`Rejected corridor [${edge.sourceId} ↔ ${edge.destId}] (${edge.distance} km) - Cycle detected.`);
            }
        }

        // Check connectivity
        const rootSet = new Set();
        nodes.forEach(n => rootSet.add(dsu.find(n.id)));
        const isFullyConnected = rootSet.size === 1;

        if (!isFullyConnected) {
            steps.push(`Network has ${rootSet.size} disconnected partitions due to damaged corridors.`);
        }

        return {
            mstEdges: mst,
            totalDistance: Math.round(totalDistance * 10) / 10,
            totalTravelTime: Math.round(totalTravelTime * 10) / 10,
            steps,
            isFullyConnected,
            partitionCount: rootSet.size
        };
    }
}
