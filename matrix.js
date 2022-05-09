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
        console.log(row);
    }
    let line_out = '[[';
    for (line of matrix) {
        line_out += line + '],\n [';
    }
    line_out = line_out.slice(0, -4) + ']';
    document.getElementById('matrixArea').value = line_out;
}


function parse_matrix(matrix)
{
    // Remove whitespace
    matrix = matrix.replace(/[\n\r]/g, '');
    matrix = matrix.replace(/ /g, '');

    let double_matrix = [];
    let stack = [];

    for (let c of matrix) {
        if (c == '{') {
            stack.push('{');
        } else if (c == '}') {
            stack.pop();
        }
        
    }
}

// Import from an adjacency matrix
function import_from_matrix(matrix) {
    clear_canvas();
    var new_nodes = [];
    var new_edges = [];
    id_next = 0;
    edge_id_next++;

    // Make the new nodes
    for (let row of matrix) {
        let node = {
            x: 100,
            y: 100,
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

    // Make the new edges
    for (let i = 0; i < new_nodes.length; i++) {
        for (let j of row) {
            if (j > 0 && !new_nodes[i].neighbors.includes(new_nodes[j])) {
                let edge = {
                    strokeStyle: NODE_BORDER_COLOR,
                    from: selection,
                    to: target,
                    id: edge_id_next,
                    weight: 1
                };
                new_edges.push(edge);
                    new_nodes[i].neighbors.push(new_nodes[j].id);
                    new_nodes[j].neighbors.push(new_nodes[i].id);
                    edge_id_next++;
            }
        }
    }
    update_edge_selector();
    draw();
}
