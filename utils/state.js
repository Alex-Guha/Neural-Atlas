import { THEME } from './defaults.js';
import * as THEMES from './themes.js';

export const globalState = {
    views: {}, // Stores views so they don't need to be rebuilt every time
    currentView: null, // Points to a view in views ^
    currentTheme: THEME, // This could be refactored to being settings['theme-selector'].state
    currentProperties: {}, // Used for architecture specific text replacement
    viewStructure: {}, // Used to display the view nav menu in the sidebar
    architectures: {}, // Stores the intermediate architecture structures (so the file doesn't need to be parsed every time)
    sidebarPersistent: false,
    settings: {
        'theme-selector': {
            label: 'Theme:',
            type: 'dropdown',
            defaultValue: 'default',
            options: ['Default', ...Object.keys(THEMES)],
        },
        'rendering-delay': { label: 'Rendering Delay', defaultValue: true, type: 'toggle' },
        'invert-theme': { label: 'Invert Theme', defaultValue: false, type: 'toggle' },
    }
}