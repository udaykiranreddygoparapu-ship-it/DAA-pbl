/**
 * Self-Balancing Red-Black Tree (RBT) for Dynamic Disaster Triage Indexing
 * DAA Project - Disaster Response Logistics
 * Time Complexity: O(log N) for Insert, Search, Min/Max
 * Space Complexity: O(N)
 */

export const RBTColor = {
    RED: 'RED',
    BLACK: 'BLACK'
};

export class NodeRBT {
    constructor(demand, color = RBTColor.RED) {
        this.demand = demand;
        this.color = color;
        this.left = null;
        this.right = null;
        this.parent = null;
    }
}

export class RedBlackTree {
    constructor() {
        this.root = null;
        this.steps = [];
    }

    rotateLeft(x) {
        const y = x.right;
        if (!y) return;

        x.right = y.left;
        if (y.left !== null) {
            y.left.parent = x;
        }

        y.parent = x.parent;
        if (x.parent === null) {
            this.root = y;
        } else if (x === x.parent.left) {
            x.parent.left = y;
        } else {
            x.parent.right = y;
        }

        y.left = x;
        x.parent = y;
    }

    rotateRight(x) {
        const y = x.left;
        if (!y) return;

        x.left = y.right;
        if (y.right !== null) {
            y.right.parent = x;
        }

        y.parent = x.parent;
        if (x.parent === null) {
            this.root = y;
        } else if (x === x.parent.right) {
            x.parent.right = y;
        } else {
            x.parent.left = y;
        }

        y.right = x;
        x.parent = y;
    }

    compareDemands(d1, d2) {
        // High priority demands first (higher integer value or lower depending on convention;
        // In Kotlin implementation: d1.priority.compareTo(d2.priority))
        if (d1.priority !== d2.priority) {
            return d1.priority - d2.priority;
        }
        if (d1.deadline !== d2.deadline) {
            return d2.deadline - d1.deadline;
        }
        return (d1.id || '').localeCompare(d2.id || '');
    }

    fixInsert(k) {
        let node = k;
        while (node.parent && node.parent.color === RBTColor.RED) {
            if (node.parent === node.parent.parent?.left) {
                const u = node.parent.parent.right; // Uncle
                if (u && u.color === RBTColor.RED) {
                    node.parent.color = RBTColor.BLACK;
                    u.color = RBTColor.BLACK;
                    node.parent.parent.color = RBTColor.RED;
                    node = node.parent.parent;
                } else {
                    if (node === node.parent.right) {
                        node = node.parent;
                        this.rotateLeft(node);
                    }
                    node.parent.color = RBTColor.BLACK;
                    if (node.parent.parent) {
                        node.parent.parent.color = RBTColor.RED;
                        this.rotateRight(node.parent.parent);
                    }
                }
            } else {
                const u = node.parent.parent?.left; // Uncle
                if (u && u.color === RBTColor.RED) {
                    node.parent.color = RBTColor.BLACK;
                    u.color = RBTColor.BLACK;
                    node.parent.parent.color = RBTColor.RED;
                    node = node.parent.parent;
                } else {
                    if (node === node.parent.left) {
                        node = node.parent;
                        this.rotateRight(node);
                    }
                    node.parent.color = RBTColor.BLACK;
                    if (node.parent.parent) {
                        node.parent.parent.color = RBTColor.RED;
                        this.rotateLeft(node.parent.parent);
                    }
                }
            }
        }
        if (this.root) this.root.color = RBTColor.BLACK;
    }

    insert(demand) {
        const node = new NodeRBT(demand);
        let y = null;
        let x = this.root;

        while (x !== null) {
            y = x;
            if (this.compareDemands(node.demand, x.demand) < 0) {
                x = x.left;
            } else {
                x = x.right;
            }
        }

        node.parent = y;
        if (y === null) {
            this.root = node;
        } else if (this.compareDemands(node.demand, y.demand) < 0) {
            y.left = node;
        } else {
            y.right = node;
        }

        if (node.parent === null) {
            node.color = RBTColor.BLACK;
            return;
        }
        if (node.parent.parent === null) {
            return;
        }

        this.fixInsert(node);
    }

    getSortedDemands() {
        const result = [];
        const inOrder = (node) => {
            if (node !== null) {
                inOrder(node.right); // Descending order
                result.push(node.demand);
                inOrder(node.left);
            }
        };
        inOrder(this.root);
        return result;
    }

    /**
     * Converts tree into a hierarchical object representation for visual SVG/HTML tree rendering
     */
    toVisualHierarchy(node = this.root) {
        if (!node) return null;
        return {
            id: node.demand.id,
            nodeId: node.demand.nodeId,
            priority: node.demand.priority,
            population: node.demand.population,
            color: node.color,
            foodReq: node.demand.foodReq,
            waterReq: node.demand.waterReq,
            medicalReq: node.demand.medicalReq,
            left: this.toVisualHierarchy(node.left),
            right: this.toVisualHierarchy(node.right)
        };
    }
}
