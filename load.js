const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

const NODE_RADIUS = 15
const NODE_COLOR = '#3a405a';
const NODE_BORDER_COLOR = '#e8c7de';
const SELECTED_NODE_COLOR = '#770000';
const SELECTED_EDGE_COLOR = '#a9efda';
const FONT_COLOR = '#a9efda';
const EDGE_WEIGHT = 3;
const BG_COLOR = '#3a405a';

ctx.fillStyle = BG_COLOR;
ctx.fillRect(0, 0, canvas.width, canvas.height);

var nodes = [];
var edges = [];
var selection = undefined;
var selected_edge = undefined;
var state = 'AddNode'
var id_next = 0;
var edge_id_next = 0;


// Set state. Used by HTML buttons
function set_state(s) {
    deselect();
    state = s;
    document.getElementById('stateText').innerHTML = 'State ' + s;
}

// Export to jpg
function export_graph() {
    window.open(canvas.toDataURL('image/png'), "");
}


// Clear canvas
function clear_canvas() {
    deselect();
    nodes.length = 0;
    edges.length = 0;
    state = 'Move';
    draw();
}


// Process mouse down action
function mousedown(e) {
    let pos = get_mouse_pos(canvas, e);
    if (state == 'Move') {
        let target = within_node(pos.x, pos.y);
        if (target) {
            select(target);
        }
    }
}


// Process mouse up action
function mouseup(e) {
    if (state == 'Move'){
    deselect();
    }

}


// Get mouse position within canvas
function get_mouse_pos(canvas, e) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
    };
}

// Detect click inside canvas border
function within_border(e) {
    pos = get_mouse_pos(canvas, e);
    rect = canvas.getBoundingClientRect();
    console.log(rect.left, rect.top);

    if (pos.x <= canvas.width && pos.y <= canvas.height) {
        return true;
    } else {
        return false;
    }
}


// Find a node given an id
function get_node_by_id(n) {
    for (let node in nodes) {
        if (node.id == n) {
            return node;
        }
    }
    return false;
}


// Find an edge given an id
function get_edge_by_id(n) {
    for (let i = 0; i < edges.length; i++) {
        if (edges[i].id == n) {
            return edges[i];
        }
    }
    return false;
}


// Update the edge selector when an edge is added
function add_edge_to_selector(edge) {
    let selector = document.getElementById('edgeselect');
    let opt = document.createElement('option');
    opt.id = edge.id;
    opt.innerHTML = edge.from.label + ' -> ' + edge.to.label;
    selector.appendChild(opt);
}


//
// Process clicks
//
function click(e) {
    if (!within_border(e))
    {
        return false;
    }
    let pos = get_mouse_pos(canvas, e);
    let target = within_node(pos.x, pos.y);
    switch(state)
    {
        case 'AddNode':
            let node = {
                x: pos.x,
                y: pos.y,
                radius: NODE_RADIUS,
                fillStyle: NODE_COLOR,
                strokeStyle: NODE_BORDER_COLOR,
                label: nodes.length,
                id: id_next,
                neighbors: []
            };
            id_next++;
            nodes.push(node);
            break;

        case 'AddEdge':
            if (target && !selection) {
                select(target)
            }
            else if (target && selection && (target !== selection)) {
                let edge = {
                            strokeStyle: NODE_BORDER_COLOR,
                            from: selection,
                            to: target,
                            id: edge_id_next
                        };
                if (!selection.neighbors.includes(target.id)) {
                    edges.push(edge);
                    selection.neighbors.push(target.id);
                    target.neighbors.push(selection.id);
                    add_edge_to_selector(edge);
                    edge_id_next++;
                }
                deselect();
            }
            else if (target) {
                select(target);
            }
            break;

        case 'SelectNode':
            if (target) {
                select(target);
            }
            break;

        case 'Delete':
            if (target) {
                delete_node(target);
            }
            break;
    }
    draw();
}


// Delete node and attached edges
function delete_node(node) {
    let index = nodes.indexOf(node);
    nodes.splice(index, 1);

    // Find the attached edges
    let edges_to_remove = [];
    for (let i=0; i<edges.length; i++) {
        if (edges[i].from == node || edges[i].to == node) {
            edges_to_remove.push(i);
        }
    }
    for (let i = edges_to_remove.length - 1; i >= 0; i--) {
        edges.splice(edges_to_remove[i], 1);
    }
    draw();
}


// Mark selected edge
function select_edge_by_id(edge_id) {
    let edge = get_edge_by_id(edge_id);
    set_state('SelectEdge');
    edge.strokeStyle = SELECTED_EDGE_COLOR;
    edge.from.strokeStyle = SELECTED_EDGE_COLOR;
    edge.to.strokeStyle = SELECTED_EDGE_COLOR;
    selected_edge = edge;
    draw();
}

// Mark selected node
function select(node) {
    if (selection) {
        deselect();
    }
    selection = node;
    selection.strokeStyle = SELECTED_EDGE_COLOR;
    document.getElementById('labelText').value = selection.label;
    draw();
}


// Clear selection
function deselect() {
    if (selection) {
        selection.strokeStyle = NODE_BORDER_COLOR;
    }

    if (selected_edge) {
        selected_edge.strokeStyle = NODE_BORDER_COLOR;
        selected_edge.from.strokeStyle = NODE_BORDER_COLOR;
        selected_edge.to.strokeStyle = NODE_BORDER_COLOR;
    }
    selection = undefined;
    selected_edge = undefined;
    draw();
}

// Return a node if (x,y) is within the circle (actually square) for that node
function within_node(x, y) {
    return nodes.find(n => {
        return x > (n.x - n.radius) &&
            y > (n.y - n.radius) &&
            x < (n.x + n.radius) &&
            y < (n.y + n.radius);
    });
}


// Move selection while in state "Move"
function move(e) {
    let pos = get_mouse_pos(canvas, e);
    if (state == 'Move' && selection){
        selection.x = pos.x;
        selection.y = pos.y;
        draw();
    }
}


//
// Draw nodes and edges
//
function draw() {
    ctx.fillStyle = BG_COLOR;
    ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
    ctx.lineWidth = EDGE_WEIGHT;
    ctx.font = '12px sans-serif';
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
        // Gotta figure out how to center properly
        ctx.fillText(node.label, node.x, node.y+4)
    }
}

// Change labels
function set_selected_label() {
    if (selection) {
        selection.label = document.getElementById('labelText').value;
        draw();
    }
}


// Generate adjacency matrix
function generate_matrix() {
    let matrix = [];
    for (node of nodes) {
        let row = [];
        console.log(node.neighbors);
        for (neighbor of nodes)
        {
            console.log(neighbor.id);
            if (node.neighbors.includes(neighbor.id)) {
                console.log('added' + ' ' + neighbor.id)
                row.push(1);
            } else {
                row.push(0);
            }
        }
        matrix.push(row);
        console.log(row);
    }
    let line_out = '[[';
    for (line of matrix) {
        line_out += line + '],\n [';
    }
    line_out = line_out.slice(0, -4) + ']';
    document.getElementById('matrixArea').value = line_out;
}


// Import from an adjacency matrix
function import_from_matrix() {
    let matrix = []
    return;
}

window.onmousemove = move;
window.onmousedown = mousedown;
window.onmouseup = mouseup;
window.onclick = click;
