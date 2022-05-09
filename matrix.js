// Generate adjacency matrix
function generate_matrix() {
    let matrix = [];
    for (const node of nodes) {
        let row = [];
        for (const neighbor of nodes)
        {
            if (node.neighbors.includes(neighbor.id)) {
                let edge = get_edge_by_vertices(node, neighbor);
                row.push(edge.weight);
            } else {
                row.push(0);
            }
        }
        matrix.push(row);
    }
    let line_out = '[[';
    for (line of matrix) {
        line_out += line + '],\n [';
    }
    line_out = line_out.slice(0, -4) + ']';
    document.getElementById('matrixArea').value = line_out;
}


// Convert matrix from text to 2d-array
function parse_matrix(matrix)
{
    // Remove whitespace
    matrix = matrix.replace(/[\n\r]/g, '');
    matrix = matrix.replace(/ /g, '');

    let double_matrix = [];
    let row = [];

    for (let c of matrix) {
        if (c != '[' && c != ']' && c != ','){
            row.push(parseInt(c));
        }
        if (c == ']' && row.length > 0) {
            double_matrix.push(row);
            row = [];
        }
    }
    return double_matrix;
}

// Import from an adjacency matrix
function import_from_matrix() {
    let matrix = parse_matrix(document.getElementById('matrixArea').value);
    clear_canvas();
    var new_nodes = [];
    var new_edges = [];
    id_next = 0;
    edge_id_next++;

    var rect = canvas.getBoundingClientRect();

    // Make the new nodes
    for (let row of matrix) {
        let node = {
            x: rect.left + 50 * id_next,
            y: rect.top + 10 * (-1)**id_next,
            radius: NODE_RADIUS,
            fillStyle: NODE_COLOR,
            strokeStyle: NODE_BORDER_COLOR,
            label: id_next,
            id: id_next,
            neighbors: []
        };
        id_next++;
        new_nodes.push(node);
    }

    // Make the new edges, avoid duplicates
    for (let i = 0; i < new_nodes.length; i++) {
        for (let j = 0; j < new_nodes.length; j++) {
            if (matrix[i][j] > 0 && !new_nodes[i].neighbors.includes(new_nodes[j].id)) {
                let edge = {
                    strokeStyle: NODE_BORDER_COLOR,
                    from: new_nodes[i],
                    to: new_nodes[j],
                    id: edge_id_next,
                    weight: matrix[i][j]
                };
                new_edges.push(edge);
                    new_nodes[i].neighbors.push(new_nodes[j].id);
                    new_nodes[j].neighbors.push(new_nodes[i].id);
                    edge_id_next++;
            }
        }
    }
    edges = new_edges;
    nodes = new_nodes;
    update_edge_selector();
    draw();
}
