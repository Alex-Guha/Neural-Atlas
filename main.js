import { loadSettings } from './core/events.js';
import { drawContent } from './core/render.js';

import { DEFAULT_VIEW } from './utils/defaults.js';
import { globalState } from './utils/state.js'
import { parseArchitectureFile } from './core/parseArchitectureFile.js';
import { parseArchitecture } from './core/parser.js';

function initializeApp(architectures = {}) {
    globalState.architectures = architectures;
    globalState.views[DEFAULT_VIEW] = parseArchitecture(DEFAULT_VIEW);
    globalState.currentView = globalState.views[DEFAULT_VIEW];

    loadSettings();
    drawContent();
}

// Load architectures first, then initialize the app
window.onload = function () {
    parseArchitectureFile('../standard_items/architectures.txt')
        .then(architectures => {
            initializeApp(architectures);
        })
        .catch(error => {
            console.error('Error parsing architecture:', error);
            // Initialize with empty architectures
            initializeApp();
        });
};