var nodes = [];
var edges = [];
var selection = undefined;
var selected_edge = undefined;
var state = 'AddNode'
var id_next = 0;
var edge_id_next = 0;


// Set state
function set_state(s) {
    deselect();
    state = s;
    document.getElementById('stateText').innerHTML = 'State ' + s;
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


function get_edge_by_vertices(node1, node2) {
    for (const edge of edges) {
        if ((edge.from.id == node1.id && edge.to.id == node2.id) || (edge.from.id == node2.id && edge.to.id == node1.id)) {
            return edge;
        }
    }
    return false;
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
    update_edge_selector();
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
    document.getElementById('edgeWeightText').value = edge.weight;
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


// Add an edge to the edge selector
function add_edge_to_selector(edge) {
    let selector = document.getElementById('edgeselect');
    let opt = document.createElement('option');
    opt.id = edge.id;
    opt.innerHTML = edge.from.label + ' -> ' + edge.to.label;
    selector.appendChild(opt);
}


// Reconstruct edge selector (called when a node is deleted)
function update_edge_selector() {
    let selector = document.getElementById('edgeselect');

    // Delete all options
    while (selector.options.length > 0) {
        selector.remove(0);
    }

    // Generate new ones
    for (const edge of edges) {
        add_edge_to_selector(edge);
    }
}

// Clear selections
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


// Change labels
function set_selected_label() {
    if (selection) {
        selection.label = document.getElementById('labelText').value;
        draw();
    }
}


// Change weights
function set_edge_weight() {
    if (selected_edge) {
        selected_edge.weight = document.getElementById('edgeWeightText').value;
        draw();
    }
}
