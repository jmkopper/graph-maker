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

window.onmousemove = move;
window.onmousedown = mousedown;
window.onmouseup = mouseup;
window.onclick = click;