import { drawContent } from './render.js';
import { navigateTo } from './navigation.js';
import { updateInfo, updateReferences } from './sidebar.js';
import { applyTheme, invertTheme } from '../utils/themeUtils.js';

import { globalState } from '../utils/state.js'
import * as DEFAULTS from '../utils/defaults.js';
import * as THEMES from '../utils/themes.js';

// Local State Variable
let persistent = false;

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
    element.on('dblclick touchend', (event) => {
        event.stopPropagation();
        persistent = false;

        // Handle touch events for mobile devices
        if (event.type === 'touchend') {
            const now = Date.now();
            const timeSinceLastTouch = now - (element._lastTouch || 0);
            element._lastTouch = now;

            // If the time between two touch events is less than 300ms, treat it as a double-tap
            if (timeSinceLastTouch < 300) {
                navigateTo(element.attr('data-details'));
            }
        } else {
            navigateTo(element.attr('data-details'));
        }
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

// =========================
// Sidebar Functions
// =========================

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

// =========================
// Settings Menu Functions
// =========================

// Handles the click event for the settings button
export const createSettings = (event) => {
    event.stopPropagation();
    persistent = true;

    const infoElement = document.getElementById('info');
    infoElement.innerHTML = '';

    // TODO Refactor
    globalState.allSettings.forEach(setting => {
        let container;
        if (setting.type === 'dropdown') {
            container = createDropdownSetting(setting);
        } else {
            container = createToggleSetting(setting);
        }
        infoElement.appendChild(container);
    });

    const advancedSettingsButton = document.createElement('button');
    advancedSettingsButton.textContent = 'Advanced Settings';
    advancedSettingsButton.style.marginTop = 'auto';
    advancedSettingsButton.addEventListener('click', createAdvancedSettings);
    infoElement.appendChild(advancedSettingsButton);
};

import { parseArchitectureFile } from './parseArchitectureFormat.js';
import { initializeApp } from '../main.js';

export const createAdvancedSettings = (event) => {
    event.stopPropagation();

    const infoElement = document.getElementById('info');
    infoElement.innerHTML = '';

    const clearArchitecturesButton = document.createElement('button');
    clearArchitecturesButton.textContent = 'Clear Saved Architectures';
    clearArchitecturesButton.addEventListener('click', () => {
        if (confirm('Are you sure you want to clear all saved architectures? This action cannot be undone.')) {
            localStorage.removeItem('architectures');
            console.debug('Cleared all saved architectures.');
            parseArchitectureFile('../standard_items/architectures.txt')
                .then(architectures => {
                    initializeApp(architectures);
                })
                .catch(error => {
                    console.error('Error parsing architecture:', error);
                    initializeApp();
                });
        }
    });
    infoElement.appendChild(clearArchitecturesButton);
};

// Draws the dropdown menu in the settings
// Currently only written for theme dropdown, would need to be modified for other dropdowns
function createDropdownSetting(setting) {
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

    select.value = globalState.currentSettings[setting.id] || 'default'; // TODO Refactor

    select.addEventListener('change', (e) => {
        const selectedTheme = e.target.value;

        // Reinvert the theme if it was inverted
        if (globalState.currentSettings['invert-theme']) { // TODO Refactor
            invertTheme(globalState.currentTheme, document.documentElement);
        }

        // Reset invert-theme setting and slider
        globalState.currentSettings['invert-theme'] = false; // TODO Refactor
        const invertThemeCheckbox = document.getElementById('invert-theme');
        if (invertThemeCheckbox) {
            invertThemeCheckbox.checked = false;
        }

        globalState.currentSettings[setting.id] = selectedTheme; // TODO Refactor

        globalState.currentTheme = THEMES[selectedTheme] || DEFAULTS.THEME;
        applyTheme(globalState.currentTheme, document.documentElement);
        saveSettings();
        drawContent();
        createSettings(e);
    });

    container.appendChild(label);
    container.appendChild(select);

    return container;
}

// Draws the default toggle switch for settings
function createToggleSetting(setting) {
    const container = document.createElement('div');
    container.className = 'switch-container';

    const toggle_switch = document.createElement('label');
    toggle_switch.className = 'switch';
    const slider = document.createElement('span');
    slider.className = 'slider';
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.id = setting.id;

    checkbox.checked = globalState.currentSettings[setting.id]; // TODO Refactor

    toggle_switch.appendChild(checkbox);
    toggle_switch.appendChild(slider);

    container.appendChild(toggle_switch);

    const label = document.createElement('label');
    label.htmlFor = setting.id;
    label.textContent = setting.label;

    container.appendChild(label);

    checkbox.addEventListener('change', (e) => {
        globalState.currentSettings[setting.id] = e.target.checked; // TODO Refactor

        if (setting.id === 'invert-theme') {
            invertTheme(globalState.currentTheme, document.documentElement);
            drawContent();
            createSettings(e);
        } else if (setting.noRedraw ?? true) {
            drawContent();
            createSettings(e);
        }
        saveSettings();
    });

    return container;
}

// =========================
// View Navigator Functions
// =========================

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
    // This logic is a bit overkill right now, since the root view will always be the first one in globalState.viewStructure
    // But, when we add more architectures and expand the view navigator, this might be useful

    // Find root views (those that don't appear as children in any other view)
    const allChildViews = new Set();
    Object.values(globalState.viewStructure).forEach(children => {
        children.forEach(child => allChildViews.add(child));
    });

    const rootViews = Object.keys(globalState.viewStructure).filter(view => !allChildViews.has(view));

    // If no root views are found, use all parent views
    const startViews = rootViews.length > 0 ? rootViews : Object.keys(globalState.viewStructure);

    // Build the tree structure
    startViews.forEach(view => {
        const viewItem = buildViewTree(view);
        treeContainer.appendChild(viewItem);
    });

    infoElement.appendChild(treeContainer);
};

// TODO work on the UI for this a bit
// Helper function to build the tree structure recursively
function buildViewTree(viewName) {
    const viewContainer = document.createElement('div');
    viewContainer.className = 'view-container';

    const viewRow = document.createElement('div');
    viewRow.className = 'view-item';
    viewRow.style.display = 'flex';

    // Create expand/collapse icon if view has children
    if (globalState.viewStructure[viewName] && globalState.viewStructure[viewName].length > 0) {
        const expandIcon = document.createElement('span');
        expandIcon.className = 'expand-icon';
        expandIcon.textContent = '▶';
        expandIcon.style.cursor = 'pointer';
        expandIcon.style.marginTop = '2px';
        expandIcon.style.marginRight = '5px';
        expandIcon.style.color = globalState.currentTheme.TEXT_COLOR;
        expandIcon.style.fontSize = '0.8em';
        expandIcon.style.transition = 'transform 0.2s';

        // Create the children container
        const childrenContainer = document.createElement('div');
        childrenContainer.className = 'view-children';
        childrenContainer.style.paddingLeft = '15px';
        childrenContainer.style.display = 'none';

        // Build child views
        globalState.viewStructure[viewName].forEach(childView => {
            const childItem = buildViewTree(childView, globalState.viewStructure);
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

// ==========================
// Edit Menu Functions
// ==========================

// Handles the click event for the nav edit button
export const showEditOptions = (event) => {
    event.stopPropagation();
    persistent = true;

    const infoElement = document.getElementById('info');
    infoElement.innerHTML = '';

    const optionsContainer = document.createElement('div');
    optionsContainer.className = 'edit-container';

    const options = [
        { id: 'edit-architecture', text: 'Edit current architecture' },
        { id: 'new-architecture', text: 'Create new architecture' },
        // TODO { id: 'new-component', text: 'Create new component' }
    ];

    options.forEach(option => {
        const button = document.createElement('button');
        button.id = option.id;
        button.textContent = option.text;
        button.className = 'edit-button';

        button.addEventListener('click', (e) => {
            e.stopPropagation();
            updateInfo('');
            // TODO create a new state variable to track if in edit mode, and modify other event listeners accordingly

            switch (option.id) {
                case 'edit-architecture':
                    handleEditArchitecture();
                    break;
                case 'new-architecture':
                    handleNewArchitecture();
                    break;
                case 'new-component':
                    handleNewComponent();
                    break;
            }
        });

        optionsContainer.appendChild(button);
    });

    infoElement.appendChild(optionsContainer);
};

import { serializeArchitecture, parseArchitectureContent } from './parseArchitectureFormat.js';

// TODO Look for a better editing solution
// Ideally indentation should be clearer
// TODO users should be able to add components from a defined list instead of typing them out - for now, think of a clever way to show what is available
function handleEditArchitecture() {
    let architecture = '';

    // Display the architectures.txt version of the architecture in a text editor
    if (Object.keys(globalState.viewStructure).length !== 0) {
        const currentArchitecture = Object.keys(globalState.viewStructure)[0];
        const intermediateStructure = globalState.architectures[currentArchitecture];
        architecture = serializeArchitecture(currentArchitecture, intermediateStructure);
    }

    createArchitectureEditor(architecture);
}

function handleNewArchitecture() {
    globalState.currentView = {};
    globalState.currentProperties = {};
    globalState.viewStructure = {};
    drawContent();
    createArchitectureEditor();
}

// XXX Potentially add event listeners for when the user navigates away while unsaved to prompt for saving changes
function createArchitectureEditor(architectureText = '') {
    const textarea = document.createElement('textarea');
    textarea.id = 'architecture-editor';
    textarea.textContent = architectureText;
    textarea.spellcheck = false;
    textarea.wrap = 'off';

    const applyButton = document.createElement('button');
    applyButton.textContent = 'Apply Changes';

    const applyChanges = (e) => {
        e.stopPropagation();
        const newArchitectureText = textarea.value;
        if (!newArchitectureText.trim()) return;

        let newArchitecture;
        try {
            newArchitecture = parseArchitectureContent(newArchitectureText);
        } catch (error) {
            console.warn(`Error parsing architecture:\n${error.message}`);
            // TODO Display this in app instead of using confirm
            confirm(`Error parsing architecture:\n${error.message}\nPlease check the syntax and try again.`);
            return;
        }

        const newArchitectureName = Object.keys(newArchitecture)[0].replace(/_\d+$/, '');

        let architectureName = newArchitectureName;
        let i = 1;
        while (globalState.views[architectureName]) {
            architectureName = `${newArchitectureName}_${i}`;
            i++;
        }

        globalState.architectures[architectureName] = Object.values(newArchitecture)[0];
        saveArchitectures();
        navigateTo(architectureName);
        createArchitectureEditor(newArchitectureText);
        persistent = true;
    };

    // Add keyboard shortcut for Ctrl+S or Cmd+S
    textarea.addEventListener('keydown', (e) => {
        // Check for Ctrl+S (Windows/Linux) or Cmd+S (Mac)
        if ((e.ctrlKey || e.metaKey) && e.key === 's') {
            e.preventDefault(); // Prevent browser's save dialog
            applyChanges(e);
        }
    });

    // Add click handler for the apply button
    applyButton.addEventListener('click', applyChanges);

    const infoElement = document.getElementById('info');
    infoElement.appendChild(textarea);
    infoElement.appendChild(applyButton);
}

function handleNewComponent() {
    console.log('Create new component clicked');
    // Functionality to be implemented
}

// =========================
// Local Storage Functions
// =========================

// TODO Refactor settings
export function loadSettings() {
    const savedSettings = JSON.parse(localStorage.getItem('currentSettings')) || {};
    Object.keys(savedSettings).forEach(key => {
        globalState.currentSettings[key] = savedSettings[key];
        console.debug(`Loaded setting: ${key} = ${savedSettings[key]}`);
    });

    // Load the saved theme directly
    globalState.currentTheme = JSON.parse(localStorage.getItem('currentTheme')) || DEFAULTS.THEME;
    applyTheme(globalState.currentTheme, document.documentElement);

    const savedArchitectures = JSON.parse(localStorage.getItem('architectures')) || {};
    Object.keys(savedArchitectures).forEach(key => {
        if (!globalState.architectures[key]) {
            globalState.architectures[key] = savedArchitectures[key];
            console.debug(`Loaded saved architecture: ${key}`);
        }
    });
}

function saveSettings() {
    localStorage.setItem('currentSettings', JSON.stringify(globalState.currentSettings));
    console.debug('Saved settings:', globalState.currentSettings);
    localStorage.setItem('currentTheme', JSON.stringify(globalState.currentTheme));
}

function saveArchitectures() {
    localStorage.setItem('architectures', JSON.stringify(globalState.architectures));
}