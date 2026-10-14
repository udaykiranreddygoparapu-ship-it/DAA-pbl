/**
 * Dijkstra's Algorithm for Emergency Dispatch & Evacuation Routing
 * DAA Project - Disaster Response Logistics
 * Time Complexity: O((V + E) log V)
 * Space Complexity: O(V + E)
 */

class PriorityQueue {
    constructor() {
        this.elements = [];
    }

    enqueue(element, priority) {
        this.elements.push({ element, priority });
        this.elements.sort((a, b) => a.priority - b.priority);
    }

    dequeue() {
        return this.elements.shift();
    }

    isEmpty() {
        return this.elements.length === 0;
    }
}

export class DijkstraAlgorithm {
    /**
     * Finds shortest path between source and target nodes avoiding blocked corridors.
     * Road corridors are bidirectional transit routes.
     * @param {Array} nodes - List of node objects { id, name, type, ... }
     * @param {Array} edges - List of edge objects { id, sourceId, destId, distance, travelTime, status, ... }
     * @param {string} sourceNodeId - Starting node ID
     * @param {string} targetNodeId - Destination node ID
     * @param {string} weightAttribute - 'distance' or 'travelTime'
     * @returns {Object} { path: Array<string>, pathNodes: Array<Object>, edgesInPath: Array<Object>, distance: number, travelTime: number, steps: Array<string> }
     */
    static findShortestPath(nodes, edges, sourceNodeId, targetNodeId, weightAttribute = 'distance') {
        const steps = [];
        steps.push(`Initializing Dijkstra routing from '${sourceNodeId}' to '${targetNodeId}' (Optimization Goal: ${weightAttribute}).`);

        const nodeMap = new Map();
        nodes.forEach(n => nodeMap.set(n.id, n));

        if (!nodeMap.has(sourceNodeId) || !nodeMap.has(targetNodeId)) {
            return {
                found: false,
                distance: Infinity,
                travelTime: Infinity,
                path: [],
                pathNodes: [],
                edgesInPath: [],
                steps: [`Error: Source or Destination node does not exist in network topology.`]
            };
        }

        if (sourceNodeId === targetNodeId) {
            return {
                found: true,
                distance: 0,
                travelTime: 0,
                path: [sourceNodeId],
                pathNodes: [nodeMap.get(sourceNodeId)],
                edgesInPath: [],
                steps: [`Source and target are identical. Zero distance required.`]
            };
        }

        // Build Bidirectional Adjacency List for unblocked corridors
        const adj = new Map();
        nodes.forEach(n => adj.set(n.id, []));

        edges.forEach(e => {
            if (e.status !== 'Blocked') {
                if (adj.has(e.sourceId)) {
                    adj.get(e.sourceId).push({
                        destId: e.destId,
                        distance: e.distance,
                        travelTime: e.travelTime || (e.distance * 3),
                        originalEdge: e
                    });
                }
                if (adj.has(e.destId)) {
                    adj.get(e.destId).push({
                        destId: e.sourceId,
                        distance: e.distance,
                        travelTime: e.travelTime || (e.distance * 3),
                        originalEdge: e
                    });
                }
            }
        });

        const dist = new Map();
        const prev = new Map();
        const prevEdge = new Map();
        const visited = new Set();
        const pq = new PriorityQueue();

        nodes.forEach(n => {
            dist.set(n.id, Infinity);
            prev.set(n.id, null);
            prevEdge.set(n.id, null);
        });

        dist.set(sourceNodeId, 0);
        pq.enqueue(sourceNodeId, 0);

        let targetReached = false;

        while (!pq.isEmpty()) {
            const currentItem = pq.dequeue();
            const currId = currentItem.element;
            const currDist = currentItem.priority;

            if (visited.has(currId)) continue;
            visited.add(currId);

            steps.push(`Relaxed node [${currId} - ${nodeMap.get(currId)?.name || ''}] with current best metric: ${currDist.toFixed(1)} ${weightAttribute === 'distance' ? 'km' : 'min'}.`);

            if (currId === targetNodeId) {
                targetReached = true;
                steps.push(`Target hub [${targetNodeId}] extracted from Min-Priority Queue. Optimal route confirmed!`);
                break;
            }

            const neighbors = adj.get(currId) || [];
            for (const edge of neighbors) {
                const neighborId = edge.destId;
                if (visited.has(neighborId)) continue;

                const edgeWeight = edge[weightAttribute] || edge.distance;
                const newDist = currDist + edgeWeight;

                if (newDist < dist.get(neighborId)) {
                    dist.set(neighborId, newDist);
                    prev.set(neighborId, currId);
                    prevEdge.set(neighborId, edge.originalEdge);
                    pq.enqueue(neighborId, newDist);
                    steps.push(`  → Relaxed corridor [${currId} ↔ ${neighborId}]: new cumulative metric = ${newDist.toFixed(1)}`);
                }
            }
        }

        if (!targetReached || dist.get(targetNodeId) === Infinity) {
            steps.push(`Target [${targetNodeId}] is unreachable from [${sourceNodeId}]. All connecting corridors are blocked by disaster hazards.`);
            return {
                found: false,
                distance: Infinity,
                travelTime: Infinity,
                path: [],
                pathNodes: [],
                edgesInPath: [],
                steps
            };
        }

        // Reconstruct path
        const path = [];
        const edgesInPath = [];
        let curr = targetNodeId;

        while (curr !== null) {
            path.push(curr);
            const edgeTaken = prevEdge.get(curr);
            if (edgeTaken) edgesInPath.push(edgeTaken);
            curr = prev.get(curr);
        }

        path.reverse();
        edgesInPath.reverse();

        const totalDistance = edgesInPath.reduce((acc, e) => acc + (e.distance || 0), 0);
        const totalTravelTime = edgesInPath.reduce((acc, e) => acc + (e.travelTime || 0), 0);

        return {
            found: true,
            distance: Math.round(totalDistance * 10) / 10,
            travelTime: Math.round(totalTravelTime * 10) / 10,
            path,
            pathNodes: path.map(id => nodeMap.get(id)),
            edgesInPath,
            steps
        };
    }
}
