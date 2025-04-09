import { allSettings, globalSettings, drawContent } from './main.js';
import { updateInfo, updateReferences } from './sidebar.js';
import { navigateTo } from './navigation.js';
import { applyTheme, invertTheme } from './utils/themeUtils.js';
import * as DEFAULTS from './utils/defaults.js';
import * as THEMES from './utils/themes.js';
import { viewStructure } from './parser.js';

// Global State Variables
let persistent = false;
export let theme = DEFAULTS.THEME;

// Attach a click listener to the background (SVG) to reset the sidebar
d3.select('#svg').on('click', resetSidebar);

// Handles hovering over items in the reference box
export function attachReferenceEventListeners(element) {
    let originalContent = null;

    element.on('mouseover', (event) => {
        // Save the current state of the info box
        const infoBox = document.getElementById('info');
        originalContent = infoBox.innerHTML;

        // Render reference data in the info box regardless of persistent state
        updateInfo(event.currentTarget.dataset.info);
    })
        .on('mouseout', () => {
            // Restore the original content of the info box
            if (originalContent !== null) {
                document.getElementById('info').innerHTML = originalContent;
                originalContent = null;
            }
        })
        .style('cursor', 'pointer');
}

// Handles items with details (double-clickable items)
export function attachDetailEventListeners(element) {
    element.on('dblclick', (event) => {
        event.stopPropagation();
        persistent = false;
        navigateTo(element.attr('data-details'));
    })
        .style('cursor', 'pointer');
}

// Generic event listener for updating the sidebar
export function attachElementEventListeners(element) {
    element.on('mouseover', (event) => {
        if (!persistent) updateSidebar(event);
    })
        .on('click', (event) => {
            event.stopPropagation(); // Prevent the background click
            persistent = true;
            updateSidebar(event);
        })
        .on('mouseout', () => {
            if (!persistent) resetSidebar();
        })
        .style('cursor', 'pointer');
}

// Resets the sidebar to its default state
export function resetSidebar() {
    persistent = false;
    updateInfo('');
    updateReferences();

    // QoL: Clear any accidental highlights
    if (window.getSelection) {
        const selection = window.getSelection();
        if (selection) selection.removeAllRanges();
    } else if (document.selection) {
        document.selection.empty();
    }
}

// Updates the sidebar with information from the hovered element
export function updateSidebar(event) {
    const target = event.currentTarget;

    // If the element has references, change the references box
    updateReferences(target.getAttribute('data-references') || null);

    // For any updateSidebar call aside from the reference list items (i.e. on hovering over elements in the svg)
    // Populate the info box with data from the element
    updateInfo(target.getAttribute('data-info') || "No additional information.");
}

// Handles the click event for the settings button
export const createSettings = (event) => {
    event.stopPropagation();
    persistent = true;

    const infoElement = document.getElementById('info');
    infoElement.innerHTML = '';

    allSettings.forEach(setting => {
        let container;
        if (setting.type === 'dropdown') {
            container = createDropdownSetting(setting, event);
        } else {
            container = createToggleSetting(setting, event);
        }
        infoElement.appendChild(container);
    });
};

// Draws the dropdown menu in the settings
// Currently only written for theme dropdown, would need to be modified for other dropdowns
function createDropdownSetting(setting, event) {
    const container = document.createElement('div');
    container.className = 'switch-container';

    const label = document.createElement('label');
    label.htmlFor = setting.id;
    label.textContent = setting.label;
    label.style.fontSize = '1.05em';

    const select = document.createElement('select');
    select.id = setting.id;

    setting.options.forEach(option => {
        const optionElement = document.createElement('option');
        optionElement.value = option.toLowerCase();
        optionElement.textContent = option.replace(/\b\w/g, char => char.toUpperCase());
        select.appendChild(optionElement);
    });

    select.value = globalSettings[setting.id] || 'default';

    select.addEventListener('change', (e) => {
        const selectedTheme = e.target.value;

        // Reinvert the theme if it was inverted
        if (globalSettings['invert-theme']) {
            invertTheme(theme, document.documentElement);
        }

        // Reset invert-theme setting and slider
        globalSettings['invert-theme'] = false;
        const invertThemeCheckbox = document.getElementById('invert-theme');
        if (invertThemeCheckbox) {
            invertThemeCheckbox.checked = false;
        }

        globalSettings[setting.id] = selectedTheme;

        theme = THEMES[selectedTheme] || DEFAULTS.THEME;
        applyTheme(theme, document.documentElement);
        saveSettings();
        drawContent();
        createSettings(event);
    });

    container.appendChild(label);
    container.appendChild(select);

    return container;
}

// Draws teh default toggle switch for settings
function createToggleSetting(setting, event) {
    const container = document.createElement('div');
    container.className = 'switch-container';

    const toggle_switch = document.createElement('label');
    toggle_switch.className = 'switch';
    const slider = document.createElement('span');
    slider.className = 'slider';
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.id = setting.id;

    checkbox.checked = globalSettings[setting.id];

    toggle_switch.appendChild(checkbox);
    toggle_switch.appendChild(slider);

    container.appendChild(toggle_switch);

    const label = document.createElement('label');
    label.htmlFor = setting.id;
    label.textContent = setting.label;

    container.appendChild(label);

    checkbox.addEventListener('change', (e) => {
        globalSettings[setting.id] = e.target.checked;

        if (setting.id === 'invert-theme') {
            invertTheme(theme, document.documentElement);
            drawContent();
            createSettings(event);
        } else if (setting.noRedraw ?? true) {
            drawContent();
            createSettings(event);
        }
        saveSettings();
    });

    return container;
}

// Handles the click event for the views menu button
export const showViews = (event) => {
    event.stopPropagation();
    persistent = true;

    const infoElement = document.getElementById('info');
    infoElement.innerHTML = '';

    // Create a title for the view tree
    const title = document.createElement('div');
    title.textContent = 'View Structure';
    title.style.marginBottom = '10px';
    title.style.fontSize = '1.2em';
    infoElement.appendChild(title);

    // Create a container for the tree
    const treeContainer = document.createElement('div');
    treeContainer.className = 'view-tree';

    // Future TODO
    // This logic is a bit overkill right now, since the root view will always be the first one in viewStructure
    // But, when we add more architectures and expand the view navigator, this might be useful

    // Find root views (those that don't appear as children in any other view)
    const allChildViews = new Set();
    Object.values(viewStructure).forEach(children => {
        children.forEach(child => allChildViews.add(child));
    });

    const rootViews = Object.keys(viewStructure).filter(view => !allChildViews.has(view));

    // If no root views are found, use all parent views
    const startViews = rootViews.length > 0 ? rootViews : Object.keys(viewStructure);

    // Build the tree structure
    startViews.forEach(view => {
        const viewItem = buildViewTree(view, viewStructure);
        treeContainer.appendChild(viewItem);
    });

    infoElement.appendChild(treeContainer);
};

// TODO work on the UI for this a bit
// Helper function to build the tree structure recursively
function buildViewTree(viewName, viewStructure) {
    const viewContainer = document.createElement('div');
    viewContainer.className = 'view-container';

    const viewRow = document.createElement('div');
    viewRow.className = 'view-item';
    viewRow.style.display = 'flex';

    // Create expand/collapse icon if view has children
    if (viewStructure[viewName] && viewStructure[viewName].length > 0) {
        const expandIcon = document.createElement('span');
        expandIcon.className = 'expand-icon';
        expandIcon.textContent = '▶';
        expandIcon.style.cursor = 'pointer';
        expandIcon.style.marginTop = '2px';
        expandIcon.style.marginRight = '5px';
        expandIcon.style.color = theme.TEXT_COLOR;
        expandIcon.style.fontSize = '0.8em';
        expandIcon.style.transition = 'transform 0.2s';

        // Create the children container
        const childrenContainer = document.createElement('div');
        childrenContainer.className = 'view-children';
        childrenContainer.style.paddingLeft = '15px';
        childrenContainer.style.display = 'none';

        // Build child views
        viewStructure[viewName].forEach(childView => {
            const childItem = buildViewTree(childView, viewStructure);
            childrenContainer.appendChild(childItem);
        });

        // Add click handler for expand/collapse
        expandIcon.addEventListener('click', (e) => {
            e.stopPropagation();
            const isExpanded = childrenContainer.style.display !== 'none';
            childrenContainer.style.display = isExpanded ? 'none' : 'block';
            expandIcon.style.transform = isExpanded ? 'rotate(0deg)' : 'rotate(90deg)';
        });

        viewRow.appendChild(expandIcon);
        viewContainer.appendChild(viewRow);
        viewContainer.appendChild(childrenContainer);
    } else {
        // Add spacing for leaf nodes (views with no children)
        const spacer = document.createElement('span');
        spacer.style.width = '0.8em';
        viewRow.appendChild(spacer);
        viewContainer.appendChild(viewRow);
    }

    // Create the view name element
    const viewLabel = document.createElement('span');
    viewLabel.textContent = viewName;
    viewLabel.style.cursor = 'pointer';

    // Add click handler to navigate to view
    viewLabel.addEventListener('click', () => {
        navigateTo(viewName);
    });

    viewRow.appendChild(viewLabel);

    return viewContainer;
}

// =========================
// Local Storage Functions
// =========================

// Load settings from localStorage
export function loadSettings() {
    const savedSettings = JSON.parse(localStorage.getItem('globalSettings')) || {};
    Object.keys(savedSettings).forEach(key => {
        globalSettings[key] = savedSettings[key];
    });

    // Load the saved theme directly
    theme = JSON.parse(localStorage.getItem('theme')) || DEFAULTS.THEME;
    applyTheme(theme, document.documentElement);
}

// Save settings and theme to localStorage
function saveSettings() {
    localStorage.setItem('globalSettings', JSON.stringify(globalSettings));
    localStorage.setItem('theme', JSON.stringify(theme)); // Save the theme object
}