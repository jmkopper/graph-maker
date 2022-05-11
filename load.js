/* load.js is the first javascript file initialized by the html page
    it contains support functions and initializes global variables
    except those related to drawing the canvas. essentially an elaborate fork of
    https://dev.to/nyxtom/drawing-interactive-graphs-with-canvas-and-javascript-o1j */

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


// Find a node given an id
function get_node_by_id(n) {
    return nodes.find(node => {
            return node.id == n;
    });
}


// Find an edge given an id
function get_edge_by_id(n) {
    return edges.find(edge => {
        return edge.id == n;
    });
}


function get_edge_by_vertices(node1, node2) {
    return edges.find(edge => {
        return (edge.from.id == node1.id && edge.to.id == node2.id) || (edge.from.id == node2.id && edge.to.id == node1.id);
    });
}



// Add an edge to the edge selector
function add_edge_to_selector(edge) {
    let selector = document.getElementById('edgeselect');
    let opt = document.createElement('option');
    opt.id = edge.id;
    opt.value = edge.id;
    opt.innerHTML = edge.from.label + ' -> ' + edge.to.label + ' weight ' + edge.weight;
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
        update_edge_selector();
        draw();
    }
}
