const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

const NODE_RADIUS = 15
const NODE_COLOR = '#22cccc'
const NODE_BORDER_COLOR = '#009999'
const SELECTED_NODE_COLOR = '#00aaaa'
const FONT_COLOR = '#000000'
const EDGE_WEIGHT = 3;

var nodes = [];
var edges = [];
var state = 'AddNode'


// Set state. Used by HTML buttons
function set_state(s) {
    state = s;
    document.getElementById('stateText').innerHTML = s + nodes.length;
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
    if (state == 'Move') {
        let target = within(e.x, e.y);
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


// Detect click inside canvas border CHANGE THIS
function within_border(e) {
    if (e.x <= 500 && e.y <= 500) {
        return true;
    } else {
        return false;
    }
}


//
// Process clicks
//
function click(e) {
    if (!within_border(e))
    {
        return false;
    }
    let target = within(e.x, e.y);
    switch(state)
    {
        case 'AddNode':
            let node = {
                x: e.x,
                y: e.y,
                radius: NODE_RADIUS,
                fillStyle: NODE_COLOR,
                strokeStyle: NODE_BORDER_COLOR,
                label: nodes.length,
                neighbors: []
            };
            nodes.push(node);
            draw();
            break;

        case 'AddEdge':
            if (target && !selection) {
                select(target)
            }
            else if (target && selection && target !== selection) {
                let edge = {from: selection, to: target};
                if (edge in edges == false) {
                    edges.push(edge);
                    from.neighbors.push(to);
                    to.neighbors.push(from);
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

// Mark selected node
function select(node) {
    if (selection) {
        deselect();
    }
    selection = node;
    selection.fillStyle = SELECTED_NODE_COLOR;
    draw();
}


// Clear selection
function deselect() {
    selection.fillStyle = NODE_COLOR;
    selection = undefined;
    draw();
}

// Return a node if (x,y) is within the circle (actually square) for that node
function within(x, y) {
    return nodes.find(n => {
        return x > (n.x - n.radius) &&
            y > (n.y - n.radius) &&
            x < (n.x + n.radius) &&
            y < (n.y + n.radius);
    });
}


// Move selection while in state "Move"
function move(e) {
    if (state == 'Move'){
        selection.x = e.x;
        selection.y = e.y;
        draw();
    }
}


//
// Draw nodes and edges
//
function draw() {
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    ctx.lineWidth = EDGE_WEIGHT;
    ctx.font = '12px sans-serif';
    ctx.textAlign = 'center';

    // Draw edges
    for (let i = 0; i < edges.length; i++) {
        let fromNode = edges[i].from;
        let toNode = edges[i].to;
        ctx.beginPath();
        ctx.strokeStyle = fromNode.strokeStyle;
        ctx.moveTo(fromNode.x, fromNode.y);
        ctx.lineTo(toNode.x, toNode.y);
        ctx.stroke();
    }

    // Draw nodes
    for (let i = 0; i < nodes.length; i++) {
        let node = nodes[i];
        ctx.beginPath();
        ctx.fillStyle = node.selected ? node.selectedFill : node.fillStyle;
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2, true);
        ctx.strokeStyle = node.strokeStyle;
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = '#000000'
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
    matrix = [];
    for (let i = 0; i < nodes.length; i++) {
        let row = [];
        for (let j = 0; j < nodes.length; j++)
        {
            if (nodes[j] in nodes[i].neighbors == true) {
                row.push(1);
            } else {
                row.push(0);
            }
            matrix.splice(1, 0, row);
        }
    }
    document.getElementById('matrixArea').value = matrix.toString();
}

window.onmousemove = move;
window.onmousedown = mousedown;
window.onmouseup = mouseup;
window.onclick = click;

var selection = undefined;
