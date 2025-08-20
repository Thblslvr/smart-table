import './fonts/ys-display/fonts.css'
import './style.css'

import {data as sourceData} from "./data/dataset_1.js";

import {initData} from "./data.js";
import {processFormData} from "./lib/utils.js";

import {initTable} from "./components/table.js";
import {initPagination} from "./components/pagination.js";
import {initSorting} from "./components/sorting.js";
import {initFiltering} from "./components/filtering.js";
import {initSearching} from "./components/searching.js";

const api = initData(sourceData);

let applySearching, applySorting, applyFiltering, applyPagination, updatePagination;

// Инициализация таблицы
const sampleTable = initTable({
    tableTemplate: 'table',
    rowTemplate: 'row',
    before: ['search', 'header', 'filter'],
    after: ['pagination']
}, render);

const appRoot = document.querySelector('#app');
appRoot.appendChild(sampleTable.container);

async function init() {
    const indexes = await api.getIndexes();
    
    // Инициализация компонентов
    applySearching = initSearching('search');
    applySorting = initSorting([
        sampleTable.header.elements.sortByDate,
        sampleTable.header.elements.sortByTotal
    ]);
    
    const filtering = initFiltering(sampleTable.filter.elements);
    applyFiltering = filtering.applyFiltering;
    
    // Обновление индексов для фильтрации
    filtering.updateIndexes(sampleTable.filter.elements, {
        searchBySeller: indexes.sellers
    });
    
    const pagination = initPagination(
        sampleTable.pagination.elements,
        (el, page, isCurrent) => {
            const input = el.querySelector('input');
            const label = el.querySelector('span');
            input.value = page;
            input.checked = isCurrent;
            label.textContent = page;
            return el;
        }
    );
    applyPagination = pagination.applyPagination;
    updatePagination = pagination.updatePagination;
}

function collectState() {
    const state = processFormData(new FormData(sampleTable.container));
    return {
        ...state,
        rowsPerPage: parseInt(state.rowsPerPage) || 10,
        page: parseInt(state.page) || 1
    };
}

async function render(action) {
    let state = collectState();
    let query = {};

    query = applySearching(query, state, action);
    query = applyFiltering(query, state, action);
    query = applySorting(query, state, action);
    query = applyPagination(query, state, action);
    
    const { total, items } = await api.getRecords(query);
    updatePagination(total, query);
    sampleTable.render(items);
}

// Запуск инициализации
init().then(render);