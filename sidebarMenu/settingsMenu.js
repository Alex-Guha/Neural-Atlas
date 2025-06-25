import { drawContent } from '../core/render.js';
import { parseArchitectureFile } from '../parser/parseArchitectureFormat.js';
import { initializeApp } from '../main.js';
import { applyTheme, invertTheme } from '../utils/themeUtils.js';
import { saveSettings } from '../utils/storage.js';

import { globalState } from '../utils/state.js'
import * as DEFAULTS from '../utils/defaults.js';
import * as THEMES from '../utils/themes.js';

// Handles the click event for the settings button
export const createSettings = (event) => {
    event.stopPropagation();
    globalState.sidebarPersistent = true;

    const infoElement = document.getElementById('info');
    infoElement.innerHTML = '';

    [{ id: 'theme-selector' }, { id: 'rendering-delay' }, { id: 'invert-theme' }].concat(globalState.views[globalState.currentView].settings).forEach(currentSetting => {
        const setting = globalState.settings[currentSetting.id];
        let container;
        switch (setting.type) {
            case 'dropdown':
                container = createDropdownSetting(setting);
                break;
            case 'toggle':
                container = createToggleSetting(setting);
                break;
            default:
                container = createToggleSetting(setting);
                break;
        }
        infoElement.appendChild(container);
    });

    const advancedSettingsButton = document.createElement('button');
    advancedSettingsButton.textContent = 'Advanced';
    advancedSettingsButton.style.marginTop = 'auto';
    advancedSettingsButton.addEventListener('click', createAdvancedSettings);
    infoElement.appendChild(advancedSettingsButton);
};

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

    select.value = setting.state;

    select.addEventListener('change', (e) => {
        const selectedTheme = e.target.value;

        // Reinvert the theme if it was inverted
        if (globalState.settings['invert-theme'].state) {
            invertTheme(globalState.currentTheme, document.documentElement);
        }

        // Reset invert-theme setting and slider
        globalState.settings['invert-theme'].state = false;
        const invertThemeCheckbox = document.getElementById('invert-theme');
        if (invertThemeCheckbox) {
            invertThemeCheckbox.checked = false;
        }

        setting.state = selectedTheme;

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

    checkbox.checked = setting.state;

    toggle_switch.appendChild(checkbox);
    toggle_switch.appendChild(slider);

    container.appendChild(toggle_switch);

    const label = document.createElement('label');
    label.htmlFor = setting.id;
    label.textContent = setting.label;

    container.appendChild(label);

    checkbox.addEventListener('change', (e) => {
        setting.state = e.target.checked;

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