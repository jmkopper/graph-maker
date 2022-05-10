/* click.js handles click and other mouse actions */

// Fuzziness of edge detection (px)
const EDGE_FORGIVENESS = 5;

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
    let edge_target = within_edge(pos.x, pos.y);
    switch(state)
    {
        case 'AddNode':
            let node = {
                x: pos.x,
                y: pos.y,
                radius: NODE_RADIUS,
                fillStyle: NODE_COLOR,
                strokeStyle: NODE_BORDER_COLOR,
                label: id_next,
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
                            id: edge_id_next,
                            weight: 1
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

        case 'Select':
            if (target) {
                select(target);
            } else if (edge_target) {
                select_edge_by_id(edge_target.id);
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


// Mark selected edge
function select_edge_by_id(edge_id) {
    deselect();
    let edge = get_edge_by_id(edge_id);
    edge.strokeStyle = SELECTED_EDGE_COLOR;
    edge.from.strokeStyle = SELECTED_EDGE_COLOR;
    edge.to.strokeStyle = SELECTED_EDGE_COLOR;
    selected_edge = edge;
    document.getElementById('edgeWeightText').value = edge.weight;
    document.getElementById('edgeselect').value = edge.id;
    draw();
}


// Mark selected node
function select(node) {
    deselect();
    selection = node;
    selection.strokeStyle = SELECTED_EDGE_COLOR;
    document.getElementById('labelText').value = selection.label;
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


// Return an edge if (x,y) is within 5px of the edge
function within_edge(x,y) {
    return edges.find(edge => {
        return Math.abs(
            ((edge.to.x-edge.from.x)*(edge.from.y-y) - (edge.from.x-x)*(edge.to.y-edge.from.y))/Math.sqrt((edge.to.x-edge.from.x)**2 + (edge.to.y-edge.from.y)**2)
        ) < EDGE_FORGIVENESS;
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

// Get mouse position within canvas
function get_mouse_pos(canvas, e) {
    return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
    };
}


// Detect click inside canvas border
function within_border(e) {
    pos = get_mouse_pos(canvas, e);
    return pos.x <= canvas.width && pos.y <= canvas.height && pos.x >= rect.left && pos.y >= rect.top;
}

window.onmousemove = move;
window.onmousedown = mousedown;
window.onmouseup = mouseup;
window.onclick = click;