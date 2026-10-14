/**
 * Prim's Algorithm for Depot-Centric Grid Expansion (MST)
 * DAA Project - Disaster Response Logistics
 * Time Complexity: O(E log V)
 * Space Complexity: O(V + E)
 */

class EdgeMinHeap {
    constructor() {
        this.heap = [];
    }

    push(edge) {
        this.heap.push(edge);
        this.bubbleUp(this.heap.length - 1);
    }

    pop() {
        if (this.heap.length === 0) return null;
        const top = this.heap[0];
        const bottom = this.heap.pop();
        if (this.heap.length > 0) {
            this.heap[0] = bottom;
            this.sinkDown(0);
        }
        return top;
    }

    isEmpty() {
        return this.heap.length === 0;
    }

    bubbleUp(idx) {
        while (idx > 0) {
            const parentIdx = Math.floor((idx - 1) / 2);
            if (this.heap[idx].distance < this.heap[parentIdx].distance) {
                [this.heap[idx], this.heap[parentIdx]] = [this.heap[parentIdx], this.heap[idx]];
                idx = parentIdx;
            } else break;
        }
    }

    sinkDown(idx) {
        const len = this.heap.length;
        while (true) {
            let smallest = idx;
            const left = 2 * idx + 1;
            const right = 2 * idx + 2;

            if (left < len && this.heap[left].distance < this.heap[smallest].distance) {
                smallest = left;
            }
            if (right < len && this.heap[right].distance < this.heap[smallest].distance) {
                smallest = right;
            }
            if (smallest !== idx) {
                [this.heap[idx], this.heap[smallest]] = [this.heap[smallest], this.heap[idx]];
                idx = smallest;
            } else break;
        }
    }
}

export class PrimAlgorithm {
    /**
     * Computes depot-centric MST starting from a designated depot node.
     * Corridors are bidirectional road links.
     * @param {Array} nodes - All nodes in network
     * @param {Array} edges - All edges in network
     * @param {string|null} startNodeId - Optional starting depot ID
     * @returns {Object} { mstEdges: Array, totalDistance: number, steps: Array<string> }
     */
    static findMinimumSpanningTree(nodes, edges, startNodeId = null) {
        const steps = [];
        if (!nodes || nodes.length === 0) {
            return { mstEdges: [], totalDistance: 0, steps: ["No nodes available."] };
        }

        // Build bidirectional adjacency list for unblocked corridors
        const adj = new Map();
        nodes.forEach(n => adj.set(n.id, []));

        edges.forEach(e => {
            if (e.status !== 'Blocked') {
                if (adj.has(e.sourceId)) {
                    adj.get(e.sourceId).push({
                        sourceId: e.sourceId,
                        destId: e.destId,
                        distance: e.distance,
                        travelTime: e.travelTime,
                        originalEdge: e
                    });
                }
                if (adj.has(e.destId)) {
                    adj.get(e.destId).push({
                        sourceId: e.destId,
                        destId: e.sourceId,
                        distance: e.distance,
                        travelTime: e.travelTime,
                        originalEdge: e
                    });
                }
            }
        });

        // Determine starting depot
        let start = startNodeId;
        if (!start || !nodes.some(n => n.id === start)) {
            const depotNode = nodes.find(n => n.type === 'Depot') || nodes[0];
            start = depotNode.id;
        }

        steps.push(`Prim's algorithm initialized at Root Depot Base: [${start}].`);

        const visited = new Set();
        const mstEdges = [];
        let totalDistance = 0;
        const pq = new EdgeMinHeap();

        visited.add(start);
        (adj.get(start) || []).forEach(e => pq.push(e));

        while (!pq.isEmpty() && visited.size < nodes.length) {
            const edge = pq.pop();
            if (!edge) break;

            const destNode = edge.destId;
            if (visited.has(destNode)) continue;

            visited.add(destNode);
            mstEdges.push(edge.originalEdge || edge);
            totalDistance += edge.distance;
            steps.push(`Linked cluster [${destNode}] via corridor (${edge.distance} km). Total hubs linked: ${visited.size}/${nodes.length}.`);

            (adj.get(destNode) || []).forEach(nextEdge => {
                if (!visited.has(nextEdge.destId)) {
                    pq.push(nextEdge);
                }
            });
        }

        return {
            mstEdges,
            totalDistance: Math.round(totalDistance * 10) / 10,
            connectedNodes: Array.from(visited),
            steps
        };
    }
}
