import { loadSettings, loadArchitectures, loadArchitectureView } from './utils/storage.js';
import { drawContent } from './core/render.js';

import { globalState } from './utils/state.js'
import { parseArchitectureFile } from './parser/parseArchitectureFormat.js';

export function initializeApp() {
    loadSettings();
    loadArchitectures();
    loadArchitectureView();
    drawContent();
}

// We only need to call parseArchitectureFile if loadArchitectures() results in an empty globalState.architectures or there were updates to the file.
// However, I can't think of a way to check for updates to the file easily, so we can simply always call parseArchitectureFile,
//   which will also implicitly ensure those architectures are up to date in localStorage.
window.onload = function () {
    parseArchitectureFile('../standard_items/architectures.txt')
        .then(architectures => {
            globalState.architectures = architectures;
            initializeApp();
        })
        .catch(error => {
            console.error('Error parsing architecture:', error);
            // Initialize with empty architectures
            initializeApp();
        });
};