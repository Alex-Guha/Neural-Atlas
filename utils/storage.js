import { applyTheme } from './themeUtils.js';
import { parseArchitecture } from '../parser/parser.js';
import { parseArchitectureFile } from '../parser/parseArchitectureFormat.js';
import { initializeApp } from '../main.js';

import { globalState } from './state.js'
import * as DEFAULTS from './defaults.js';

export function loadSettings() {
    const savedSettings = JSON.parse(localStorage.getItem('settings')) || {};
    Object.keys(savedSettings).forEach(key => {
        globalState.settings[key] = savedSettings[key];
    });
    //console.debug('Loaded settings:', savedSettings);

    // Load the saved theme directly
    globalState.currentTheme = JSON.parse(localStorage.getItem('currentTheme')) || DEFAULTS.THEME;
    applyTheme(globalState.currentTheme, document.documentElement);
}

export function saveSettings() {
    localStorage.setItem('settings', JSON.stringify(globalState.settings));
    //console.debug('Saved settings:', globalState.settings);
    localStorage.setItem('currentTheme', JSON.stringify(globalState.currentTheme));
}

// Only appends saved architectures, doesn't overwrite ones read from file at startup
export function loadArchitectures() {
    const savedArchitectures = JSON.parse(localStorage.getItem('architectures')) || {};
    Object.keys(savedArchitectures).forEach(key => {
        if (!globalState.architectures[key]) {
            globalState.architectures[key] = savedArchitectures[key];
            //console.debug(`Loaded saved architecture: ${key}`);
        }
    });
}

export function saveArchitectures() {
    localStorage.setItem('architectures', JSON.stringify(globalState.architectures));
}

export function clearArchitectures() {
    localStorage.removeItem('architectures');
    localStorage.removeItem('currentArchitecture');
    globalState.viewStructure = {};
    parseArchitectureFile('../standard_items/architectures.txt')
        .then(architectures => {
            globalState.architectures = architectures;
            initializeApp();
        })
        .catch(error => {
            console.error('Error parsing architecture:', error);
            initializeApp();
        });
}


export function loadArchitectureView() {
    const currentArchitecture = localStorage.getItem('currentArchitecture') || DEFAULTS.DEFAULT_VIEW;
    globalState.currentArchitecture = currentArchitecture;

    globalState.views[currentArchitecture] = parseArchitecture(currentArchitecture);
    globalState.currentView = currentArchitecture;
}

export function saveArchitectureView() {
    saveArchitectures();

    localStorage.setItem('currentArchitecture', globalState.currentArchitecture);
}