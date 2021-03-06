/* canvas.js handles draw and other canvas-related actions */

const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

const NODE_RADIUS = 15
const NODE_COLOR = '#FBFBFF';
const NODE_BORDER_COLOR = '#0B7189';
const SELECTED_NODE_COLOR = '#FBFBFF';
const SELECTED_EDGE_COLOR = '#F49D6E';
const FONT_COLOR = '#0B7189';
const EDGE_WEIGHT = 3;
const BG_COLOR = '#FBFBFF';
const FONT_STYLE = 'bold 14px sans-serif';

ctx.fillStyle = BG_COLOR;
ctx.fillRect(0, 0, canvas.width, canvas.height);

var rect = canvas.getBoundingClientRect();


//
// Draw nodes and edges
//
function draw() {
    ctx.fillStyle = BG_COLOR;
    ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
    ctx.lineWidth = EDGE_WEIGHT;
    ctx.font = FONT_STYLE;
    ctx.textAlign = 'center';

    // Draw edges
    for (let i = 0; i < edges.length; i++) {
        let fromNode = edges[i].from;
        let toNode = edges[i].to;
        ctx.beginPath();
        ctx.strokeStyle = edges[i].strokeStyle;
        ctx.moveTo(fromNode.x, fromNode.y);
        ctx.lineTo(toNode.x, toNode.y);
        ctx.stroke();
    }

    // Draw nodes
    for (let i = 0; i < nodes.length; i++) {
        let node = nodes[i];
        ctx.beginPath();
        ctx.fillStyle = node.fillStyle;
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2, true);
        ctx.strokeStyle = node.strokeStyle;
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = FONT_COLOR;
        // Gotta figure out how to center properly rather than y+4
        ctx.fillText(node.label, node.x, node.y+4)
    }
}

// Export to png
function export_graph() {
    window.open(canvas.toDataURL('image/png'), "");
}


// Clear canvas
function clear_canvas() {
    deselect();
    nodes.length = 0;
    edges.length = 0;
    set_state('Move');
    update_edge_selector();
    draw();
    id_next = 0;
}
