import {cloneTemplate} from "../lib/utils.js";

export function initTable(settings, onAction) {
    const {tableTemplate, rowTemplate, before, after} = settings;
    const root = cloneTemplate(tableTemplate);

    // Вывод шаблонов до и после таблицы
    before.reverse().forEach(templateId => {
        const template = cloneTemplate(templateId);
        root[templateId] = template;
        root.container.prepend(template.container);
    });
    
    after.forEach(templateId => {
        const template = cloneTemplate(templateId);
        root[templateId] = template;
        root.container.append(template.container);
    });
    
    // Обработка событий
    root.container.addEventListener('change', () => onAction());
    root.container.addEventListener('reset', () => setTimeout(onAction));
    root.container.addEventListener('submit', e => {
        e.preventDefault();
        onAction(e.submitter);
    });

    const render = (data) => {
        // Формирование строк таблицы
        const nextRows = data.map(item => {
            const row = cloneTemplate(rowTemplate);
            Object.keys(item).forEach(key => {
                if (row.elements[key]) {
                    row.elements[key].textContent = item[key];
                }
            });
            return row.container;
        });
        root.elements.rows.replaceChildren(...nextRows);
    }

    return {...root, render};
}