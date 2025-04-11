import { THEME } from './defaults.js';

export const globalState = {
    views: {}, // Stores views so they don't need to be rebuilt every time
    currentView: null,
    currentTheme: THEME,
    currentSettings: [],
    allSettings: [],
    viewStructure: {}, // Used to display the view structure in the sidebar
}