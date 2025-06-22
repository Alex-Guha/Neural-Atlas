import { applyTheme } from './themeUtils.js';

import { globalState } from './state.js'
import * as DEFAULTS from './defaults.js';

export function loadSettings() {
    const savedSettings = JSON.parse(localStorage.getItem('settings')) || {};
    Object.keys(savedSettings).forEach(key => {
        globalState.settings[key] = savedSettings[key];
    });
    console.debug('Loaded settings:', savedSettings);

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
    localStorage.setItem('settings', JSON.stringify(globalState.settings));
    console.debug('Saved settings:', globalState.settings);
    localStorage.setItem('currentTheme', JSON.stringify(globalState.currentTheme));
}

export function saveArchitectures() {
    localStorage.setItem('architectures', JSON.stringify(globalState.architectures));
}