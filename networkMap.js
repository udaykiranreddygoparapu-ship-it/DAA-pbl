/**
 * Interactive Geographic Network Map & Canvas Visualizer
 * Disaster Response Logistics Optimization System (EOC)
 * High-performance HTML5 Canvas with Pan, Zoom, Interactive Tooltips,
 * Real-time Road Disruption Toggling, and Algorithmic Highlights.
 */

// Canvas roundRect Polyfill for universal browser compatibility
if (typeof CanvasRenderingContext2D !== 'undefined' && !CanvasRenderingContext2D.prototype.roundRect) {
    CanvasRenderingContext2D.prototype.roundRect = function (x, y, w, h, radii) {
        let r = radii || 0;
        if (typeof r === 'number') r = [r, r, r, r];
        else if (Array.isArray(r) && r.length === 1) r = [r[0], r[0], r[0], r[0]];
        const tl = r[0] || 0, tr = r[1] || 0, br = r[2] || 0, bl = r[3] || 0;
        this.beginPath();
        this.moveTo(x + tl, y);
        this.lineTo(x + w - tr, y);
        this.quadraticCurveTo(x + w, y, x + w, y + tr);
        this.lineTo(x + w, y + h - br);
        this.quadraticCurveTo(x + w, y + h, x + w - br, y + h);
        this.lineTo(x + bl, y + h);
        this.quadraticCurveTo(x, y + h, x, y + h - bl);
        this.lineTo(x, y + tl);
        this.quadraticCurveTo(x, y, x + tl, y);
        this.closePath();
        return this;
    };
}

export class NetworkMap {
    constructor(canvasContainerId, onNodeClick, onEdgeClick) {
        this.container = document.getElementById(canvasContainerId);
        if (!this.container) throw new Error(`Container #${canvasContainerId} not found`);

        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.container.appendChild(this.canvas);

        this.onNodeClick = onNodeClick || (() => {});
        this.onEdgeClick = onEdgeClick || (() => {});

        // State
        this.nodes = [];
        this.edges = [];
        this.activeDijkstraResult = null;
        this.activeMstResult = null;
        this.selectedSourceId = null;
        this.selectedTargetId = null;

        // Viewport Transform (Pan & Zoom)
        this.scale = 1.0;
        this.panX = 0;
        this.panY = 0;
        this.isDragging = false;
        this.dragStartX = 0;
        this.dragStartY = 0;
        this.dragDistance = 0;

        // Visual Options
        this.showDijkstra = true;
        this.showMst = true;
        this.showLabels = true;
        this.showDistanceTags = true;

        // Hover & Interaction
        this.hoveredNode = null;
        this.hoveredEdge = null;
        this.animationFrameId = null;
        this.animOffset = 0;

        this.initCanvasSize();
        this.initEvents();
        this.startAnimationLoop();
    }

    initCanvasSize() {
        const dpr = window.devicePixelRatio || 1;
        const rect = this.container.getBoundingClientRect();
        this.width = Math.max(300, rect.width || 800);
        this.height = Math.max(300, rect.height || 540);

        this.canvas.width = this.width * dpr;
        this.canvas.height = this.height * dpr;
        this.canvas.style.width = `${this.width}px`;
        this.canvas.style.height = `${this.height}px`;

        this.ctx.setTransform(1, 0, 0, 1, 0, 0);
        this.ctx.scale(dpr, dpr);
    }

    setData(nodes, edges, dijkstraResult = null, mstResult = null, sourceId = null, targetId = null) {
        this.nodes = nodes || [];
        this.edges = edges || [];
        this.activeDijkstraResult = dijkstraResult;
        this.activeMstResult = mstResult;
        this.selectedSourceId = sourceId;
        this.selectedTargetId = targetId;

        this.computeAutoBounds();
        this.render();
    }

    computeAutoBounds() {
        if (!this.nodes.length) return;

        let minLat = Infinity, maxLat = -Infinity;
        let minLng = Infinity, maxLng = -Infinity;

        this.nodes.forEach(n => {
            if (n.lat < minLat) minLat = n.lat;
            if (n.lat > maxLat) maxLat = n.lat;
            if (n.lng < minLng) minLng = n.lng;
            if (n.lng > maxLng) maxLng = n.lng;
        });

        // 20% margin
        let latSpan = Math.max(0.01, maxLat - minLat);
        let lngSpan = Math.max(0.01, maxLng - minLng);
        const midLat = (minLat + maxLat) / 2;
        const midLng = (minLng + maxLng) / 2;

        // Correct for geographic aspect ratio (1 deg lon = cos(lat) * 1 deg lat)
        const latRad = midLat * (Math.PI / 180);
        const lonScale = Math.cos(latRad);
        const canvasAspect = (this.width > 0 && this.height > 0) ? (this.width / this.height) : 1.6;
        const geoAspect = (lngSpan * lonScale) / latSpan;

        if (geoAspect < canvasAspect) {
            // Expand longitude span to fit canvas width proportionally
            const neededLngSpan = (latSpan * canvasAspect) / lonScale;
            minLng = midLng - neededLngSpan / 2;
            maxLng = midLng + neededLngSpan / 2;
            minLat -= latSpan * 0.15;
            maxLat += latSpan * 0.15;
        } else {
            // Expand latitude span to fit canvas height proportionally
            const neededLatSpan = (lngSpan * lonScale) / canvasAspect;
            minLat = midLat - neededLatSpan / 2;
            maxLat = midLat + neededLatSpan / 2;
            minLng -= lngSpan * 0.15;
            maxLng += lngSpan * 0.15;
        }

        this.bounds = { minLat, maxLat, minLng, maxLng };
        this.scale = 1.0;
        this.panX = 0;
        this.panY = 0;
    }

    toScreen(lat, lng) {
        if (!this.bounds) return { x: this.width / 2, y: this.height / 2 };

        const { minLat, maxLat, minLng, maxLng } = this.bounds;
        const spanX = Math.max(0.0001, maxLng - minLng);
        const spanY = Math.max(0.0001, maxLat - minLat);

        const rawX = ((lng - minLng) / spanX) * this.width;
        // Invert Y because latitude increases northward while canvas Y increases downward
        const rawY = this.height - (((lat - minLat) / spanY) * this.height);

        return {
            x: (rawX * this.scale) + this.panX,
            y: (rawY * this.scale) + this.panY
        };
    }

    initEvents() {
        window.addEventListener('resize', () => {
            this.initCanvasSize();
            this.render();
        });

        // Mouse Drag / Pan
        this.canvas.addEventListener('mousedown', (e) => {
            this.isDragging = true;
            this.dragDistance = 0;
            this.dragStartX = e.clientX - this.panX;
            this.dragStartY = e.clientY - this.panY;
            this.canvas.style.cursor = 'grabbing';
        });

        window.addEventListener('mousemove', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;

            if (this.isDragging) {
                const newPanX = e.clientX - this.dragStartX;
                const newPanY = e.clientY - this.dragStartY;
                this.dragDistance += Math.hypot(newPanX - this.panX, newPanY - this.panY);
                this.panX = newPanX;
                this.panY = newPanY;
                this.render();
                return;
            }

            if (mouseX >= 0 && mouseX <= this.width && mouseY >= 0 && mouseY <= this.height) {
                this.handleHover(mouseX, mouseY);
            }
        });

        window.addEventListener('mouseup', () => {
            if (this.isDragging) {
                this.isDragging = false;
                this.canvas.style.cursor = 'grab';
            }
        });

        // Mouse Wheel Zoom
        this.canvas.addEventListener('wheel', (e) => {
            e.preventDefault();
            const rect = this.canvas.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;

            const zoomFactor = e.deltaY < 0 ? 1.15 : 0.85;
            const newScale = Math.min(8.0, Math.max(0.4, this.scale * zoomFactor));

            // Zoom centered at mouse cursor
            this.panX = mouseX - (mouseX - this.panX) * (newScale / this.scale);
            this.panY = mouseY - (mouseY - this.panY) * (newScale / this.scale);
            this.scale = newScale;

            this.render();
        }, { passive: false });

        // Click detection (only if not a pan drag)
        this.canvas.addEventListener('click', (e) => {
            if (this.dragDistance > 6) return; // Ignore clicks resulting from dragging

            const rect = this.canvas.getBoundingClientRect();
            const clickX = e.clientX - rect.left;
            const clickY = e.clientY - rect.top;

            // Check if clicked a node
            const clickedNode = this.getNodeAt(clickX, clickY);
            if (clickedNode) {
                this.onNodeClick(clickedNode);
                return;
            }

            // Check if clicked an edge
            const clickedEdge = this.getEdgeAt(clickX, clickY);
            if (clickedEdge) {
                this.onEdgeClick(clickedEdge);
            }
        });

        this.canvas.style.cursor = 'grab';
    }

    handleHover(mouseX, mouseY) {
        const node = this.getNodeAt(mouseX, mouseY);
        const edge = !node ? this.getEdgeAt(mouseX, mouseY) : null;

        if (this.hoveredNode !== node || this.hoveredEdge !== edge) {
            this.hoveredNode = node;
            this.hoveredEdge = edge;
            this.canvas.style.cursor = node || edge ? 'pointer' : (this.isDragging ? 'grabbing' : 'grab');
            this.render();
        }
    }

    getNodeAt(screenX, screenY) {
        const radiusHit = 22;
        for (let i = this.nodes.length - 1; i >= 0; i--) {
            const node = this.nodes[i];
            const pos = this.toScreen(node.lat, node.lng);
            const dist = Math.hypot(screenX - pos.x, screenY - pos.y);
            if (dist <= radiusHit) return node;
        }
        return null;
    }

    getEdgeAt(screenX, screenY) {
        const threshold = 12;
        const nodeMap = new Map(this.nodes.map(n => [n.id, n]));

        for (const edge of this.edges) {
            const u = nodeMap.get(edge.sourceId);
            const v = nodeMap.get(edge.destId);
            if (!u || !v) continue;

            const p1 = this.toScreen(u.lat, u.lng);
            const p2 = this.toScreen(v.lat, v.lng);

            const dist = this.distToSegment({ x: screenX, y: screenY }, p1, p2);
            if (dist <= threshold) return edge;
        }
        return null;
    }

    distToSegment(p, v, w) {
        const l2 = (w.x - v.x) ** 2 + (w.y - v.y) ** 2;
        if (l2 === 0) return Math.hypot(p.x - v.x, p.y - v.y);
        let t = ((p.x - v.x) * (w.x - v.x) + (p.y - v.y) * (w.y - v.y)) / l2;
        t = Math.max(0, Math.min(1, t));
        return Math.hypot(p.x - (v.x + t * (w.x - v.x)), p.y - (v.y + t * (w.y - v.y)));
    }

    zoomIn() {
        this.scale = Math.min(8.0, this.scale * 1.25);
        this.render();
    }

    zoomOut() {
        this.scale = Math.max(0.4, this.scale * 0.8);
        this.render();
    }

    resetView() {
        this.computeAutoBounds();
        this.render();
    }

    startAnimationLoop() {
        const loop = () => {
            this.animOffset = (this.animOffset + 0.6) % 30;
            if (this.activeDijkstraResult?.found) {
                this.render();
            }
            this.animationFrameId = requestAnimationFrame(loop);
        };
        this.animationFrameId = requestAnimationFrame(loop);
    }

    render() {
        const ctx = this.ctx;
        ctx.clearRect(0, 0, this.width, this.height);

        // Draw tactical background grid
        this.drawTacticalGrid();

        if (!this.nodes.length) {
            ctx.fillStyle = '#64748b';
            ctx.font = '14px Inter, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText('No topology nodes loaded.', this.width / 2, this.height / 2);
            return;
        }

        const nodeMap = new Map(this.nodes.map(n => [n.id, n]));

        // 1. Draw Regular Edges
        this.drawEdges(nodeMap);

        // 2. Draw MST Backbone Highlight
        if (this.showMst && this.activeMstResult?.mstEdges) {
            this.drawMstOverlay(nodeMap, this.activeMstResult.mstEdges);
        }

        // 3. Draw Dijkstra Shortest Path Overlay
        if (this.showDijkstra && this.activeDijkstraResult?.found) {
            this.drawDijkstraOverlay(nodeMap, this.activeDijkstraResult.path);
        }

        // 4. Draw Nodes
        this.drawNodes();

        // 5. Draw Tooltips
        this.drawTooltips();
    }

    drawTacticalGrid() {
        const ctx = this.ctx;
        const gridSize = 40 * this.scale;
        const offsetX = this.panX % gridSize;
        const offsetY = this.panY % gridSize;

        ctx.save();
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
        ctx.lineWidth = 1;

        for (let x = offsetX; x < this.width; x += gridSize) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, this.height);
            ctx.stroke();
        }

        for (let y = offsetY; y < this.height; y += gridSize) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(this.width, y);
            ctx.stroke();
        }
        ctx.restore();
    }

    drawEdges(nodeMap) {
        const ctx = this.ctx;

        this.edges.forEach(edge => {
            const u = nodeMap.get(edge.sourceId);
            const v = nodeMap.get(edge.destId);
            if (!u || !v) return;

            const p1 = this.toScreen(u.lat, u.lng);
            const p2 = this.toScreen(v.lat, v.lng);

            ctx.save();
            const isBlocked = edge.status === 'Blocked';
            const isHovered = this.hoveredEdge === edge;

            if (isBlocked) {
                // Hazard Blocked Corridor
                ctx.strokeStyle = isHovered ? '#ff4d6d' : 'rgba(239, 68, 68, 0.75)';
                ctx.lineWidth = isHovered ? 4 : 2.5;
                ctx.setLineDash([8, 6]);
            } else {
                // Open Corridor
                ctx.strokeStyle = isHovered ? '#38bdf8' : 'rgba(148, 163, 184, 0.35)';
                ctx.lineWidth = isHovered ? 3.5 : 2;
                ctx.setLineDash([]);
            }

            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();

            // Distance Tag
            if (this.showDistanceTags) {
                const midX = (p1.x + p2.x) / 2;
                const midY = (p1.y + p2.y) / 2;

                ctx.setLineDash([]);
                ctx.fillStyle = isBlocked ? 'rgba(239, 68, 68, 0.9)' : 'rgba(15, 23, 42, 0.85)';
                ctx.strokeStyle = isBlocked ? '#ef4444' : 'rgba(148, 163, 184, 0.3)';
                ctx.lineWidth = 1;

                const text = isBlocked ? '✖ BLOCKED' : `${edge.distance} km`;
                ctx.font = '10px Inter, monospace';
                const metrics = ctx.measureText(text);
                const pad = 4;
                const boxW = metrics.width + pad * 2;
                const boxH = 14;

                ctx.beginPath();
                ctx.roundRect(midX - boxW / 2, midY - boxH / 2, boxW, boxH, 3);
                ctx.fill();
                ctx.stroke();

                ctx.fillStyle = isBlocked ? '#ffffff' : '#94a3b8';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(text, midX, midY);
            }

            ctx.restore();
        });
    }

    drawMstOverlay(nodeMap, mstEdges) {
        const ctx = this.ctx;
        ctx.save();
        ctx.strokeStyle = '#10b981'; // Neon Emerald
        ctx.lineWidth = 5;
        ctx.shadowColor = '#10b981';
        ctx.shadowBlur = 12;
        ctx.setLineDash([]);

        mstEdges.forEach(edge => {
            const u = nodeMap.get(edge.sourceId);
            const v = nodeMap.get(edge.destId);
            if (!u || !v) return;

            const p1 = this.toScreen(u.lat, u.lng);
            const p2 = this.toScreen(v.lat, v.lng);

            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
        });
        ctx.restore();
    }

    drawDijkstraOverlay(nodeMap, path) {
        if (!path || path.length < 2) return;
        const ctx = this.ctx;
        ctx.save();

        ctx.strokeStyle = '#06b6d4'; // Electric Cyan / Radiant Blue
        ctx.lineWidth = 6;
        ctx.shadowColor = '#06b6d4';
        ctx.shadowBlur = 16;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        ctx.beginPath();
        for (let i = 0; i < path.length; i++) {
            const node = nodeMap.get(path[i]);
            if (!node) continue;
            const p = this.toScreen(node.lat, node.lng);
            if (i === 0) ctx.moveTo(p.x, p.y);
            else ctx.lineTo(p.x, p.y);
        }
        ctx.stroke();

        // Pulsing Light Pulse along the route
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2.5;
        ctx.setLineDash([10, 20]);
        ctx.lineDashOffset = -this.animOffset;
        ctx.stroke();

        ctx.restore();
    }

    drawNodes() {
        const ctx = this.ctx;

        this.nodes.forEach(node => {
            const pos = this.toScreen(node.lat, node.lng);
            const isHovered = this.hoveredNode === node;
            const isSource = this.selectedSourceId === node.id;
            const isTarget = this.selectedTargetId === node.id;

            ctx.save();

            // Highlight ring for Source/Target/Hover
            if (isSource || isTarget || isHovered) {
                ctx.beginPath();
                ctx.arc(pos.x, pos.y, 22, 0, Math.PI * 2);
                if (isSource) {
                    ctx.strokeStyle = '#06b6d4';
                    ctx.fillStyle = 'rgba(6, 182, 212, 0.2)';
                } else if (isTarget) {
                    ctx.strokeStyle = '#a855f7';
                    ctx.fillStyle = 'rgba(168, 85, 247, 0.2)';
                } else {
                    ctx.strokeStyle = '#ffffff';
                    ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
                }
                ctx.lineWidth = 2;
                ctx.fill();
                ctx.stroke();
            }

            // Node Core Styling by Type
            let baseColor = '#3b82f6';
            let iconText = 'D';

            if (node.type === 'Depot') {
                baseColor = '#2563eb'; // Royal Blue
                iconText = '⛟';
            } else if (node.type === 'Hospital') {
                baseColor = '#ef4444'; // Crimson
                iconText = '✚';
            } else if (node.type === 'Shelter') {
                baseColor = '#f59e0b'; // Amber
                iconText = '⛺';
            }

            // Main node circle
            ctx.shadowColor = baseColor;
            ctx.shadowBlur = isHovered ? 16 : 8;
            ctx.fillStyle = baseColor;
            ctx.beginPath();
            ctx.arc(pos.x, pos.y, 14, 0, Math.PI * 2);
            ctx.fill();

            // Inner border
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 1.5;
            ctx.stroke();

            // Node Glyph
            ctx.shadowBlur = 0;
            ctx.fillStyle = '#ffffff';
            ctx.font = '12px Inter, sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(iconText, pos.x, pos.y);

            // Node Label
            if (this.showLabels) {
                ctx.font = 'bold 11px Inter, sans-serif';
                ctx.fillStyle = '#f8fafc';
                ctx.shadowColor = 'rgba(0, 0, 0, 0.9)';
                ctx.shadowBlur = 4;
                ctx.fillText(node.name, pos.x, pos.y + 24);

                // Type badge
                ctx.font = '9px Inter, monospace';
                ctx.fillStyle = '#94a3b8';
                ctx.fillText(`[${node.id}]`, pos.x, pos.y + 36);
            }

            ctx.restore();
        });
    }

    drawTooltips() {
        const ctx = this.ctx;

        if (this.hoveredNode) {
            const n = this.hoveredNode;
            const pos = this.toScreen(n.lat, n.lng);

            const lines = [
                `📍 ${n.name} (${n.type})`,
                `ID: ${n.id} | Priority Rank: ${n.priority}`,
                `Capacity: ${n.capacity.toLocaleString()} persons`,
                `Local Supplies: ${n.availableResources} units`,
                `Geo: ${n.lat.toFixed(4)}°N, ${n.lng.toFixed(4)}°E`,
                `👉 Click to set Route Point or Inspect`
            ];

            this.renderTooltipBox(pos.x, pos.y - 30, lines);
        } else if (this.hoveredEdge) {
            const e = this.hoveredEdge;
            const nodeMap = new Map(this.nodes.map(n => [n.id, n]));
            const u = nodeMap.get(e.sourceId);
            const v = nodeMap.get(e.destId);

            if (u && v) {
                const p1 = this.toScreen(u.lat, u.lng);
                const p2 = this.toScreen(v.lat, v.lng);
                const midX = (p1.x + p2.x) / 2;
                const midY = (p1.y + p2.y) / 2;

                const lines = [
                    `🛣️ Corridor: ${u.name} ↔ ${v.name}`,
                    `Distance: ${e.distance} km | Travel Time: ${e.travelTime || '--'} min`,
                    `Status: ${e.status.toUpperCase()} (Disruption Risk: ${(e.disruptionProb * 100).toFixed(0)}%)`,
                    `Vehicle Capacity: ${e.capacity} vehicles/hr`,
                    `⚡ Click corridor to toggle Open / Blocked`
                ];

                this.renderTooltipBox(midX, midY - 20, lines);
            }
        }
    }

    renderTooltipBox(x, y, lines) {
        const ctx = this.ctx;
        ctx.save();
        ctx.font = '11px Inter, sans-serif';

        let maxW = 0;
        lines.forEach(l => {
            const w = ctx.measureText(l).width;
            if (w > maxW) maxW = w;
        });

        const padX = 12;
        const padY = 10;
        const lineH = 16;
        const boxW = maxW + padX * 2;
        const boxH = lines.length * lineH + padY * 2;

        let drawX = x - boxW / 2;
        let drawY = y - boxH - 10;

        // Keep inside canvas bounds
        if (drawX < 10) drawX = 10;
        if (drawX + boxW > this.width - 10) drawX = this.width - boxW - 10;
        if (drawY < 10) drawY = y + 25;

        // Tooltip container
        ctx.fillStyle = 'rgba(15, 23, 42, 0.95)';
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)';
        ctx.lineWidth = 1;
        ctx.shadowColor = 'rgba(0, 0, 0, 0.6)';
        ctx.shadowBlur = 12;

        ctx.beginPath();
        ctx.roundRect(drawX, drawY, boxW, boxH, 8);
        ctx.fill();
        ctx.stroke();

        // Tooltip text
        ctx.shadowBlur = 0;
        ctx.textAlign = 'left';
        ctx.textBaseline = 'top';

        lines.forEach((line, idx) => {
            if (idx === 0) {
                ctx.fillStyle = '#38bdf8';
                ctx.font = 'bold 12px Inter, sans-serif';
            } else if (line.includes('BLOCKED')) {
                ctx.fillStyle = '#ef4444';
                ctx.font = '11px Inter, sans-serif';
            } else if (line.startsWith('👉') || line.startsWith('⚡')) {
                ctx.fillStyle = '#a855f7';
                ctx.font = 'italic 10px Inter, sans-serif';
            } else {
                ctx.fillStyle = '#cbd5e1';
                ctx.font = '11px Inter, sans-serif';
            }
            ctx.fillText(line, drawX + padX, drawY + padY + idx * lineH);
        });

        ctx.restore();
    }
}
