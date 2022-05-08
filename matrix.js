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


// Import from an adjacency matrix
function import_from_matrix() {
    let matrix = []
    return;
}