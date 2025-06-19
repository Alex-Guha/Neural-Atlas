import * as THEMES from './themes.js';

// TODO Refactor
export const generalSettings = [
    {
        label: 'Theme:',
        id: 'theme-selector',
        type: 'dropdown',
        options: ['Default', ...Object.keys(THEMES)]
    },
    { label: 'Rendering Delay', id: 'rendering-delay', defaultValue: true },
    { label: 'Invert Theme', id: 'invert-theme' }
];