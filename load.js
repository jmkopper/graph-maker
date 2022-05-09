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



// Add an edge to the edge selector
function add_edge_to_selector(edge) {
    let selector = document.getElementById('edgeselect');
    let opt = document.createElement('option');
    opt.id = edge.id;
    opt.value = edge.id;
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
        update_edge_selector();
        draw();
    }
}


// Change weights
function set_edge_weight() {
    if (selected_edge) {
        selected_edge.weight = document.getElementById('edgeWeightText').value;
        document.getElementById('edgeText').innerHTML = 'Updated edge weight to ' + selected_edge.weight;
        draw();
    }
}
