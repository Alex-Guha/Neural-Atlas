import { THEME } from './defaults.js';
import { generalSettings } from './settings.js';

export const globalState = {
    views: {}, // Stores views so they don't need to be rebuilt every time
    currentView: null, // Points to a view in views ^
    currentTheme: THEME,
    currentSettings: generalSettings,
    allSettings: [],
    viewStructure: {}, // Used to display the view nav menu in the sidebar
}