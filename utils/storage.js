import { applyTheme } from './themeUtils.js';

import { globalState } from './state.js'
import * as DEFAULTS from './defaults.js';

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

export function saveSettings() {
    localStorage.setItem('currentSettings', JSON.stringify(globalState.currentSettings));
    console.debug('Saved settings:', globalState.currentSettings);
    localStorage.setItem('currentTheme', JSON.stringify(globalState.currentTheme));
}

export function saveArchitectures() {
    localStorage.setItem('architectures', JSON.stringify(globalState.architectures));
}