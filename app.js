/**
 * Main Application Controller - EOC Disaster Response Logistics
 * Handles state synchronization, algorithmic orchestration,
 * interactive controls, and UI view rendering.
 */

import { SCENARIOS_DATA } from './data/scenarios.js';
import { DijkstraAlgorithm } from './algorithms/dijkstra.js';
import { KruskalAlgorithm } from './algorithms/kruskal.js';
import { PrimAlgorithm } from './algorithms/prim.js';
import { KnapsackAlgorithm } from './algorithms/knapsack.js';
import { GreedyAlgorithm } from './algorithms/greedy.js';
import { RedBlackTree } from './algorithms/redBlackTree.js';
import { NetworkMap } from './networkMap.js';

class EocApp {
    constructor() {
        // Deep clone scenarios so mutations remain isolated
        this.scenarios = JSON.parse(JSON.stringify(SCENARIOS_DATA));
        this.activeScenarioId = "SCENARIO_1";
        this.currentScenario = this.scenarios.find(s => s.id === this.activeScenarioId);

        // Algorithm Parameters
        this.sourceNodeId = null;
        this.targetNodeId = null;
        this.knapsackCapacity = 100;
        this.selectedWeightAttr = 'distance';

        // Cached algorithm results
        this.results = {
            dijkstra: null,
            kruskal: null,
            prim: null,
            knapsack: null,
            greedy: null,
            rbt: null
        };

        // Navigation
        this.activeTab = 'kpis';
        this.logs = [];

        this.init();
    }

    init() {
        this.initClock();
        this.initScenarioSelector();
        this.initNavigation();
        this.initNetworkMap();
        this.initAlgorithmEvents();
        this.initSimulatorEvents();
        this.initInventoryEvents();

        this.logMessage(`System initialized. EOC Logistics Platform active for ${this.currentScenario.name}.`);
        this.loadScenario(this.activeScenarioId);
    }

    initClock() {
        const clockEl = document.getElementById('liveClock');
        const updateClock = () => {
            const now = new Date();
            // Nepal Standard Time (UTC+5:45)
            const nptOptions = { timeZone: 'Asia/Kathmandu', hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' };
            const dateOptions = { timeZone: 'Asia/Kathmandu', month: 'short', day: '2-digit', year: 'numeric' };
            if (clockEl) {
                clockEl.textContent = `NPT ${now.toLocaleTimeString('en-US', nptOptions)} | ${now.toLocaleDateString('en-US', dateOptions)}`;
            }
        };
        updateClock();
        setInterval(updateClock, 1000);
    }

    initScenarioSelector() {
        const select = document.getElementById('scenarioSelector');
        if (!select) return;

        select.innerHTML = '';
        this.scenarios.forEach(sc => {
            const opt = document.createElement('option');
            opt.value = sc.id;
            opt.textContent = `${sc.name} [${sc.category.toUpperCase()}]`;
            select.appendChild(opt);
        });

        select.addEventListener('change', (e) => {
            this.loadScenario(e.target.value);
        });

        // Quick action: Reset scenario
        const resetBtn = document.getElementById('btnResetScenario');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                const freshCopy = JSON.parse(JSON.stringify(SCENARIOS_DATA.find(s => s.id === this.activeScenarioId)));
                const idx = this.scenarios.findIndex(s => s.id === this.activeScenarioId);
                this.scenarios[idx] = freshCopy;
                this.currentScenario = freshCopy;
                this.logMessage(`Reset scenario '${this.currentScenario.name}' to initial ground truth.`);
                this.recalculateAll();
                this.showToast('Scenario data reset successfully', 'info');
            });
        }
    }

    initNavigation() {
        const navButtons = document.querySelectorAll('.nav-tab-btn');
        navButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const targetTab = btn.getAttribute('data-tab');
                this.switchTab(targetTab);
            });
        });
    }

    switchTab(tabId) {
        this.activeTab = tabId;

        // Update button states
        document.querySelectorAll('.nav-tab-btn').forEach(btn => {
            if (btn.getAttribute('data-tab') === tabId) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });

        // Update tab view visibility
        document.querySelectorAll('.tab-view').forEach(view => {
            if (view.id === `view-${tabId}`) {
                view.classList.add('active');
            } else {
                view.classList.remove('active');
            }
        });

        // Trigger map resize if switching to map
        if (tabId === 'map' && this.networkMap) {
            setTimeout(() => {
                this.networkMap.initCanvasSize();
                this.networkMap.computeAutoBounds();
                this.networkMap.render();
            }, 60);
        }
    }

    initNetworkMap() {
        const container = document.getElementById('networkMapContainer');
        if (!container) return;

        this.networkMap = new NetworkMap(
            'networkMapContainer',
            (node) => this.handleMapNodeClick(node),
            (edge) => this.handleMapEdgeClick(edge)
        );

        // Map control buttons
        document.getElementById('btnZoomIn')?.addEventListener('click', () => this.networkMap.zoomIn());
        document.getElementById('btnZoomOut')?.addEventListener('click', () => this.networkMap.zoomOut());
        document.getElementById('btnResetView')?.addEventListener('click', () => this.networkMap.resetView());

        // Map layer toggles
        document.getElementById('toggleMstOverlay')?.addEventListener('change', (e) => {
            this.networkMap.showMst = e.target.checked;
            this.networkMap.render();
        });
        document.getElementById('toggleDijkstraOverlay')?.addEventListener('change', (e) => {
            this.networkMap.showDijkstra = e.target.checked;
            this.networkMap.render();
        });
        document.getElementById('toggleDistanceLabels')?.addEventListener('change', (e) => {
            this.networkMap.showDistanceTags = e.target.checked;
            this.networkMap.render();
        });
    }

    handleMapNodeClick(node) {
        this.openNodeModal(node);
    }

    handleMapEdgeClick(edge) {
        // Toggle road status
        const newStatus = edge.status === 'Blocked' ? 'Open' : 'Blocked';
        edge.status = newStatus;

        // Also update corresponding reverse edge if any
        const rev = this.currentScenario.edges.find(e => e.sourceId === edge.destId && e.destId === edge.sourceId);
        if (rev) rev.status = newStatus;

        this.logMessage(`Corridor [${edge.sourceId} ↔ ${edge.destId}] status modified to: ${newStatus.toUpperCase()}`);
        this.showToast(`Corridor ${edge.sourceId} ↔ ${edge.destId} is now ${newStatus.toUpperCase()}`, newStatus === 'Blocked' ? 'danger' : 'success');

        this.recalculateAll();
    }

    loadScenario(scenarioId) {
        this.activeScenarioId = scenarioId;
        this.currentScenario = this.scenarios.find(s => s.id === scenarioId);

        // Default Dijkstra endpoints: First Depot and First Shelter
        const depot = this.currentScenario.nodes.find(n => n.type === 'Depot') || this.currentScenario.nodes[0];
        const shelter = this.currentScenario.nodes.find(n => n.type === 'Shelter') || this.currentScenario.nodes[this.currentScenario.nodes.length - 1];

        this.sourceNodeId = depot?.id || null;
        this.targetNodeId = shelter?.id || null;

        // Update Header Info
        document.getElementById('scenarioTitle').textContent = this.currentScenario.name;
        document.getElementById('scenarioLocation').textContent = this.currentScenario.location;
        document.getElementById('scenarioDesc').textContent = this.currentScenario.description;

        const severityBadge = document.getElementById('scenarioSeverity');
        if (severityBadge) {
            severityBadge.textContent = this.currentScenario.severity;
            severityBadge.className = `badge severity-${this.currentScenario.severity.toLowerCase()}`;
        }

        this.updateNodeDropdowns();
        this.recalculateAll();
        this.logMessage(`Loaded scenario '${this.currentScenario.name}' with ${this.currentScenario.nodes.length} nodes and ${this.currentScenario.edges.length} corridors.`);
    }

    updateNodeDropdowns() {
        const srcSelect = document.getElementById('dijkstraSource');
        const tgtSelect = document.getElementById('dijkstraTarget');

        if (!srcSelect || !tgtSelect) return;

        srcSelect.innerHTML = '';
        tgtSelect.innerHTML = '';

        this.currentScenario.nodes.forEach(node => {
            const opt1 = document.createElement('option');
            opt1.value = node.id;
            opt1.textContent = `${node.name} (${node.type} - [${node.id}])`;
            if (node.id === this.sourceNodeId) opt1.selected = true;
            srcSelect.appendChild(opt1);

            const opt2 = document.createElement('option');
            opt2.value = node.id;
            opt2.textContent = `${node.name} (${node.type} - [${node.id}])`;
            if (node.id === this.targetNodeId) opt2.selected = true;
            tgtSelect.appendChild(opt2);
        });
    }

    recalculateAll() {
        const { nodes, edges, resources, demands } = this.currentScenario;

        // 1. Dijkstra
        if (this.sourceNodeId && this.targetNodeId) {
            this.results.dijkstra = DijkstraAlgorithm.findShortestPath(
                nodes,
                edges,
                this.sourceNodeId,
                this.targetNodeId,
                this.selectedWeightAttr
            );
        } else {
            this.results.dijkstra = null;
        }

        // 2. Kruskal MST
        this.results.kruskal = KruskalAlgorithm.findMinimumSpanningTree(nodes, edges);

        // 3. Prim MST
        this.results.prim = PrimAlgorithm.findMinimumSpanningTree(nodes, edges, this.sourceNodeId);

        // 4. Knapsack 0/1
        this.results.knapsack = KnapsackAlgorithm.solve(this.knapsackCapacity, resources);

        // 5. Greedy Allocation
        this.results.greedy = GreedyAlgorithm.allocateResources(demands, resources);

        // 6. Red-Black Tree
        const rbt = new RedBlackTree();
        demands.forEach(d => rbt.insert(d));
        this.results.rbt = {
            tree: rbt,
            sortedDemands: rbt.getSortedDemands(),
            visualHierarchy: rbt.toVisualHierarchy()
        };

        // Render Views
        this.renderKpis();
        this.renderNetworkMap();
        this.renderAlgorithms();
        this.renderSimulator();
        this.renderInventory();
    }

    renderKpis() {
        const { demands, nodes, resources } = this.currentScenario;
        const greedyRes = this.results.greedy;

        const totalAffected = demands.reduce((acc, d) => acc + (d.population || 0), 0);
        const activeDepots = nodes.filter(n => n.type === 'Depot').length;
        const totalResources = resources.reduce((acc, r) => acc + (r.quantity || 0), 0);
        const satisfactionPercent = greedyRes ? greedyRes.overallSatisfactionPercent : 0;

        document.getElementById('kpiTotalAffected').textContent = totalAffected.toLocaleString();
        document.getElementById('kpiActiveDepots').textContent = activeDepots;
        document.getElementById('kpiTotalResources').textContent = totalResources.toLocaleString();
        document.getElementById('kpiDemandSatisfaction').textContent = `${satisfactionPercent}%`;

        // Progress Bars
        const satBar = document.getElementById('kpiSatisfactionProgressBar');
        if (satBar) satBar.style.width = `${Math.min(100, satisfactionPercent)}%`;

        if (greedyRes?.commodityStats) {
            const { food, water, medical } = greedyRes.commodityStats;
            document.getElementById('kpiFoodProgress').style.width = `${food.pct}%`;
            document.getElementById('kpiFoodLabel').textContent = `${food.alloc.toLocaleString()} / ${food.req.toLocaleString()} (${food.pct}%)`;

            document.getElementById('kpiWaterProgress').style.width = `${water.pct}%`;
            document.getElementById('kpiWaterLabel').textContent = `${water.alloc.toLocaleString()} / ${water.req.toLocaleString()} (${water.pct}%)`;

            document.getElementById('kpiMedicalProgress').style.width = `${medical.pct}%`;
            document.getElementById('kpiMedicalLabel').textContent = `${medical.alloc.toLocaleString()} / ${medical.req.toLocaleString()} (${medical.pct}%)`;
        }

        // Infrastructure Connectivity KPI
        const kruskalRes = this.results.kruskal;
        const networkStatusBadge = document.getElementById('kpiNetworkStatus');
        if (networkStatusBadge && kruskalRes) {
            if (kruskalRes.isFullyConnected) {
                networkStatusBadge.textContent = 'CONNECTED (1 COMPONENT)';
                networkStatusBadge.className = 'status-tag status-success';
            } else {
                networkStatusBadge.textContent = `PARTITIONED (${kruskalRes.partitionCount} COMPONENTS)`;
                networkStatusBadge.className = 'status-tag status-danger';
            }
        }
    }

    renderNetworkMap() {
        if (!this.networkMap) return;
        this.networkMap.setData(
            this.currentScenario.nodes,
            this.currentScenario.edges,
            this.results.dijkstra,
            this.results.kruskal,
            this.sourceNodeId,
            this.targetNodeId
        );
    }

    renderAlgorithms() {
        // --- 1. Dijkstra ---
        const dijkstraRes = this.results.dijkstra;
        const dijStatus = document.getElementById('dijkstraStatus');
        const dijDist = document.getElementById('dijkstraDistance');
        const dijTime = document.getElementById('dijkstraTime');
        const dijPathDisplay = document.getElementById('dijkstraPathDisplay');
        const dijTrace = document.getElementById('dijkstraStepsTrace');

        if (dijkstraRes && dijkstraRes.found) {
            if (dijStatus) {
                dijStatus.textContent = 'OPTIMAL PATH FOUND';
                dijStatus.className = 'badge badge-success';
            }
            if (dijDist) dijDist.textContent = `${dijkstraRes.distance.toFixed(1)} km`;
            if (dijTime) dijTime.textContent = `${dijkstraRes.travelTime.toFixed(0)} min`;
            if (dijPathDisplay) {
                dijPathDisplay.innerHTML = dijkstraRes.path.map((nodeId, idx) => {
                    const node = this.currentScenario.nodes.find(n => n.id === nodeId);
                    const name = node ? node.name : nodeId;
                    return `<span class="path-node-pill"><span class="step-num">${idx+1}</span> ${name}</span>`;
                }).join('<span class="path-arrow">➔</span>');
            }
        } else {
            if (dijStatus) {
                dijStatus.textContent = 'UNREACHABLE / CORRIDOR BLOCKED';
                dijStatus.className = 'badge badge-danger';
            }
            if (dijDist) dijDist.textContent = '∞';
            if (dijTime) dijTime.textContent = '∞';
            if (dijPathDisplay) dijPathDisplay.innerHTML = '<span class="text-danger">No unblocked route exists between selected nodes.</span>';
        }

        if (dijTrace && dijkstraRes) {
            dijTrace.innerHTML = dijkstraRes.steps.map(s => `<li>${s}</li>`).join('');
        }

        // --- 2. Kruskal & Prim MST ---
        const kruskal = this.results.kruskal;
        const prim = this.results.prim;

        document.getElementById('kruskalEdgeCount').textContent = kruskal ? kruskal.mstEdges.length : 0;
        document.getElementById('kruskalTotalWeight').textContent = kruskal ? `${kruskal.totalDistance} km` : '0 km';
        document.getElementById('primTotalWeight').textContent = prim ? `${prim.totalDistance} km` : '0 km';

        const mstEdgesList = document.getElementById('mstEdgesTableBody');
        if (mstEdgesList && kruskal) {
            mstEdgesList.innerHTML = kruskal.mstEdges.map(e => `
                <tr>
                    <td><code>${e.sourceId}</code> ↔ <code>${e.destId}</code></td>
                    <td><strong>${e.distance} km</strong></td>
                    <td>${e.travelTime || '--'} min</td>
                    <td><span class="badge badge-success">INCLUDED IN MST</span></td>
                </tr>
            `).join('');
        }

        // --- 3. Knapsack ---
        const knapsack = this.results.knapsack;
        document.getElementById('knapsackCapacityDisplay').textContent = `${this.knapsackCapacity} units`;
        document.getElementById('knapsackMaxValue').textContent = knapsack ? knapsack.maxValue : 0;
        document.getElementById('knapsackWeightConsumed').textContent = knapsack ? `${knapsack.totalWeight} / ${this.knapsackCapacity}` : 0;
        document.getElementById('knapsackEfficiency').textContent = knapsack ? `${knapsack.efficiency}%` : '0%';

        const knapsackItemsList = document.getElementById('knapsackSelectedItemsList');
        if (knapsackItemsList && knapsack) {
            if (knapsack.selectedResources.length === 0) {
                knapsackItemsList.innerHTML = '<div class="empty-state">No packages packed within capacity limit.</div>';
            } else {
                knapsackItemsList.innerHTML = knapsack.selectedResources.map(r => `
                    <div class="payload-item-card">
                        <div class="payload-type">${r.type}</div>
                        <div class="payload-meta">Weight: <strong>${r.weight}</strong> | Utility: <strong class="text-accent">+${r.value}</strong></div>
                    </div>
                `).join('');
            }
        }

        // DP Preview Grid
        const dpGrid = document.getElementById('knapsackDpPreview');
        if (dpGrid && knapsack?.dpTablePreview?.sampleCols) {
            const cols = knapsack.dpTablePreview.sampleCols;
            let html = `<thead><tr><th>Relief Batch</th>${cols.map(c => `<th>Cap ${c}</th>`).join('')}</tr></thead><tbody>`;
            knapsack.dpTablePreview.rows.forEach(r => {
                html += `<tr><td><strong>${r.itemLabel}</strong></td>${r.values.map(v => `<td>${v}</td>`).join('')}</tr>`;
            });
            html += `</tbody>`;
            dpGrid.innerHTML = html;
        }

        // --- 4. Greedy Allocation ---
        const greedy = this.results.greedy;
        const greedyTbody = document.getElementById('greedyAllocationsTableBody');
        if (greedyTbody && greedy) {
            greedyTbody.innerHTML = greedy.shelterFulfillment.map(s => `
                <tr>
                    <td><strong>${s.nodeId}</strong></td>
                    <td><span class="badge ${s.priority === 1 ? 'badge-danger' : s.priority === 2 ? 'badge-warning' : 'badge-info'}">Rank ${s.priority}</span></td>
                    <td>${s.food.allocated} / ${s.food.requested}</td>
                    <td>${s.water.allocated} / ${s.water.requested}</td>
                    <td>${s.medical.allocated} / ${s.medical.requested}</td>
                    <td>
                        <div class="progress-bar-container">
                            <div class="progress-bar" style="width: ${s.satisfactionPercent}%;"></div>
                        </div>
                        <span class="text-sm">${s.satisfactionPercent}%</span>
                    </td>
                </tr>
            `).join('');
        }

        // --- 5. Red-Black Tree Triage ---
        const rbt = this.results.rbt;
        const rbtList = document.getElementById('rbtSortedDemandsList');
        if (rbtList && rbt?.sortedDemands) {
            rbtList.innerHTML = rbt.sortedDemands.map((d, idx) => `
                <div class="triage-queue-item priority-border-${d.priority}">
                    <div class="triage-order">#${idx+1}</div>
                    <div class="triage-content">
                        <div class="triage-header">
                            <strong>${d.nodeId}</strong> (Demand ID: <code>${d.id}</code>)
                            <span class="badge ${d.priority === 1 ? 'badge-danger' : 'badge-warning'}">Triage Priority ${d.priority}</span>
                        </div>
                        <div class="triage-details">
                            Pop: <strong>${d.population.toLocaleString()}</strong> |
                            Food Req: <strong>${d.foodReq}</strong> |
                            Water Req: <strong>${d.waterReq}</strong> |
                            Med Req: <strong>${d.medicalReq}</strong>
                        </div>
                    </div>
                </div>
            `).join('');
        }

        // Visual RBT Tree Diagram
        const rbtVisualContainer = document.getElementById('rbtTreeVisual');
        if (rbtVisualContainer && rbt?.visualHierarchy) {
            rbtVisualContainer.innerHTML = '';
            rbtVisualContainer.appendChild(this.buildVisualRbtNode(rbt.visualHierarchy));
        }
    }

    buildVisualRbtNode(node) {
        if (!node) return document.createTextNode('');

        const container = document.createElement('div');
        container.className = 'rbt-tree-branch';

        const nodeEl = document.createElement('div');
        nodeEl.className = `rbt-node-box rbt-color-${node.color.toLowerCase()}`;
        nodeEl.innerHTML = `
            <div class="rbt-node-title">${node.nodeId}</div>
            <div class="rbt-node-prio">Prio: ${node.priority}</div>
            <div class="rbt-node-badge">${node.color}</div>
        `;
        container.appendChild(nodeEl);

        if (node.left || node.right) {
            const childrenWrapper = document.createElement('div');
            childrenWrapper.className = 'rbt-children-wrapper';

            if (node.left) {
                const leftChild = this.buildVisualRbtNode(node.left);
                childrenWrapper.appendChild(leftChild);
            } else {
                const nullLeft = document.createElement('div');
                nullLeft.className = 'rbt-null-leaf';
                nullLeft.textContent = 'NIL (B)';
                childrenWrapper.appendChild(nullLeft);
            }

            if (node.right) {
                const rightChild = this.buildVisualRbtNode(node.right);
                childrenWrapper.appendChild(rightChild);
            } else {
                const nullRight = document.createElement('div');
                nullRight.className = 'rbt-null-leaf';
                nullRight.textContent = 'NIL (B)';
                childrenWrapper.appendChild(nullRight);
            }

            container.appendChild(childrenWrapper);
        }

        return container;
    }

    renderSimulator() {
        const tbody = document.getElementById('simulatorRoadsTableBody');
        if (!tbody) return;

        tbody.innerHTML = this.currentScenario.edges.map(edge => {
            const isBlocked = edge.status === 'Blocked';
            return `
                <tr class="${isBlocked ? 'row-blocked' : ''}">
                    <td><strong>${edge.sourceId} ↔ ${edge.destId}</strong></td>
                    <td>${edge.distance} km</td>
                    <td>${edge.travelTime || '--'} min</td>
                    <td>Risk Level ${edge.riskLevel} (${(edge.disruptionProb * 100).toFixed(0)}%)</td>
                    <td>
                        <span class="badge ${isBlocked ? 'badge-danger' : 'badge-success'}">
                            ${edge.status.toUpperCase()}
                        </span>
                    </td>
                    <td>
                        <button class="btn btn-sm ${isBlocked ? 'btn-success' : 'btn-danger'} btn-toggle-corridor" data-edge-id="${edge.id}">
                            ${isBlocked ? '✓ Reopen Corridor' : '✖ Block Corridor'}
                        </button>
                    </td>
                </tr>
            `;
        }).join('');

        // Attach listeners
        tbody.querySelectorAll('.btn-toggle-corridor').forEach(btn => {
            btn.addEventListener('click', () => {
                const edgeId = btn.getAttribute('data-edge-id');
                const edge = this.currentScenario.edges.find(e => e.id === edgeId);
                if (edge) this.handleMapEdgeClick(edge);
            });
        });
    }

    renderInventory() {
        const depotTbody = document.getElementById('inventoryDepotsTableBody');
        const demandTbody = document.getElementById('inventoryDemandsTableBody');

        if (depotTbody) {
            depotTbody.innerHTML = this.currentScenario.resources.map(r => `
                <tr>
                    <td><code>${r.id}</code></td>
                    <td><strong>${r.nodeId}</strong></td>
                    <td><span class="badge badge-info">${r.type}</span></td>
                    <td><strong>${r.quantity.toLocaleString()}</strong></td>
                    <td>${r.weight} units</td>
                    <td>+${r.value} survival utility</td>
                </tr>
            `).join('');
        }

        if (demandTbody) {
            demandTbody.innerHTML = this.currentScenario.demands.map(d => `
                <tr>
                    <td><code>${d.id}</code></td>
                    <td><strong>${d.nodeId}</strong></td>
                    <td>${d.population.toLocaleString()}</td>
                    <td>${d.foodReq}</td>
                    <td>${d.waterReq}</td>
                    <td>${d.medicalReq}</td>
                    <td><span class="badge ${d.priority === 1 ? 'badge-danger' : 'badge-warning'}">Rank ${d.priority}</span></td>
                    <td><span class="badge badge-secondary">${d.status}</span></td>
                </tr>
            `).join('');
        }
    }

    initAlgorithmEvents() {
        // Dijkstra Search Button
        document.getElementById('btnRunDijkstra')?.addEventListener('click', () => {
            this.sourceNodeId = document.getElementById('dijkstraSource')?.value || this.sourceNodeId;
            this.targetNodeId = document.getElementById('dijkstraTarget')?.value || this.targetNodeId;
            this.selectedWeightAttr = document.getElementById('dijkstraWeightAttr')?.value || 'distance';

            this.logMessage(`Running Dijkstra search from [${this.sourceNodeId}] to [${this.targetNodeId}].`);
            this.recalculateAll();
            this.showToast('Dijkstra Shortest Path recalculated!', 'info');
        });

        // Knapsack Slider / Capacity change
        const capInput = document.getElementById('knapsackCapacityInput');
        const capSlider = document.getElementById('knapsackCapacitySlider');

        const updateCapacity = (val) => {
            const num = parseInt(val, 10) || 50;
            this.knapsackCapacity = num;
            if (capInput) capInput.value = num;
            if (capSlider) capSlider.value = num;
            this.recalculateAll();
        };

        capInput?.addEventListener('input', (e) => updateCapacity(e.target.value));
        capSlider?.addEventListener('input', (e) => updateCapacity(e.target.value));

        document.getElementById('btnRunKnapsack')?.addEventListener('click', () => {
            this.recalculateAll();
            this.showToast('0/1 Knapsack optimization solved!', 'success');
        });
    }

    initSimulatorEvents() {
        // Random Landslide / Earthquake Disruption Simulation
        document.getElementById('btnSimulateDisruption')?.addEventListener('click', () => {
            const openEdges = this.currentScenario.edges.filter(e => e.status !== 'Blocked');
            if (openEdges.length === 0) {
                this.showToast('All corridors are already blocked!', 'warning');
                return;
            }

            // Pick 1 or 2 edges weighted by disruption probability
            const pick = openEdges[Math.floor(Math.random() * openEdges.length)];
            pick.status = 'Blocked';

            // Also reverse edge
            const rev = this.currentScenario.edges.find(e => e.sourceId === pick.destId && e.destId === pick.sourceId);
            if (rev) rev.status = 'Blocked';

            this.logMessage(`SIMULATION ALERT: Seismic aftershock triggered landslide! Corridor [${pick.sourceId} ↔ ${pick.destId}] is now BLOCKED.`);
            this.showToast(`🚨 Landslide severed corridor ${pick.sourceId} ↔ ${pick.destId}!`, 'danger');
            this.recalculateAll();
        });

        // Restore all corridors
        document.getElementById('btnRestoreAllCorridors')?.addEventListener('click', () => {
            this.currentScenario.edges.forEach(e => e.status = 'Open');
            this.logMessage(`ENGINEERING CORPS: Road clearance teams have restored and reopened all corridors.`);
            this.showToast('All transit corridors restored to OPEN status.', 'success');
            this.recalculateAll();
        });
    }

    initInventoryEvents() {
        // Add Resource Quick Action
        document.getElementById('btnOpenAddResourceModal')?.addEventListener('click', () => {
            const modal = document.getElementById('addResourceModal');
            if (modal) modal.classList.add('show');
        });

        document.getElementById('btnSubmitAddResource')?.addEventListener('click', () => {
            const type = document.getElementById('newResType')?.value || 'Food';
            const qty = parseInt(document.getElementById('newResQty')?.value, 10) || 100;
            const weight = parseInt(document.getElementById('newResWeight')?.value, 10) || 10;
            const value = parseInt(document.getElementById('newResValue')?.value, 10) || 50;
            const depotNode = this.currentScenario.nodes.find(n => n.type === 'Depot') || this.currentScenario.nodes[0];

            const newRes = {
                id: `R_${Date.now().toString().slice(-4)}`,
                scenarioId: this.activeScenarioId,
                nodeId: depotNode.id,
                type,
                quantity: qty,
                weight,
                value
            };

            this.currentScenario.resources.push(newRes);
            if (depotNode) {
                depotNode.availableResources = (depotNode.availableResources || 0) + qty;
            }
            this.logMessage(`Added new relief resource stock: ${qty} units of ${type} at depot [${depotNode.id}].`);
            this.closeModals();
            this.recalculateAll();
            this.showToast(`Added ${qty} units of ${type} to inventory.`, 'success');
        });
    }

    openNodeModal(node) {
        const modal = document.getElementById('nodeDetailsModal');
        if (!modal) return;

        document.getElementById('modalNodeName').textContent = node.name;
        document.getElementById('modalNodeType').textContent = node.type;
        document.getElementById('modalNodeId').textContent = node.id;
        document.getElementById('modalNodeCoords').textContent = `${node.lat.toFixed(4)}°N, ${node.lng.toFixed(4)}°E`;
        document.getElementById('modalNodeCapacity').textContent = node.capacity.toLocaleString();
        document.getElementById('modalNodeResources').textContent = node.availableResources.toLocaleString();

        // Modal Action Buttons
        const setSrcBtn = document.getElementById('modalBtnSetSource');
        const setTgtBtn = document.getElementById('modalBtnSetTarget');

        if (setSrcBtn) {
            setSrcBtn.onclick = () => {
                this.sourceNodeId = node.id;
                this.updateNodeDropdowns();
                this.recalculateAll();
                this.closeModals();
                this.showToast(`Set '${node.name}' as Dijkstra Source Node`, 'info');
            };
        }

        if (setTgtBtn) {
            setTgtBtn.onclick = () => {
                this.targetNodeId = node.id;
                this.updateNodeDropdowns();
                this.recalculateAll();
                this.closeModals();
                this.showToast(`Set '${node.name}' as Dijkstra Target Node`, 'info');
            };
        }

        modal.classList.add('show');
    }

    closeModals() {
        document.querySelectorAll('.modal-overlay').forEach(m => m.classList.remove('show'));
    }

    logMessage(msg) {
        const timeStr = new Date().toLocaleTimeString('en-US', { hour12: false });
        this.logs.unshift({ time: timeStr, text: msg });
        if (this.logs.length > 50) this.logs.pop();

        const logContainer = document.getElementById('eocCommFeed');
        if (logContainer) {
            logContainer.innerHTML = this.logs.slice(0, 15).map(l => `
                <div class="log-entry">
                    <span class="log-time">[${l.time}]</span>
                    <span class="log-msg">${l.text}</span>
                </div>
            `).join('');
        }
    }

    showToast(message, type = 'info') {
        const container = document.getElementById('toastContainer');
        if (!container) return;

        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.innerHTML = `
            <span class="toast-indicator"></span>
            <span class="toast-text">${message}</span>
        `;
        container.appendChild(toast);

        setTimeout(() => {
            toast.classList.add('fade-out');
            setTimeout(() => toast.remove(), 400);
        }, 3200);
    }
}

// Global initialization
window.addEventListener('DOMContentLoaded', () => {
    window.app = new EocApp();

    // Close modal handlers
    document.querySelectorAll('.modal-close, .modal-overlay').forEach(el => {
        el.addEventListener('click', (e) => {
            if (e.target === el || el.classList.contains('modal-close') || el.closest('.modal-close')) {
                window.app.closeModals();
            }
        });
    });
});
