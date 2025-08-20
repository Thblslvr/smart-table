import {sortMap} from "../lib/sort.js";

export function initSorting(columns) {
    return (query, state, action) => {
        let field = null;
        let order = null;

        if (action && action.name === 'sort') {
            action.dataset.value = sortMap[action.dataset.value];
            field = action.dataset.field;
            order = action.dataset.value;
            
            columns.forEach(col => {
                if (col !== action) col.dataset.value = 'none';
            });
        } else {
            columns.forEach(col => {
                if (col.dataset.value !== 'none') {
                    field = col.dataset.field;
                    order = col.dataset.value;
                }
            });
        }

        const sort = (field && order !== 'none') ? `${field}:${order}` : null;
        return sort ? Object.assign({}, query, { sort }) : query;
    };
}