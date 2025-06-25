import { globalState } from '../utils/state.js'

export const checkSettingsToggle = (obj) => {
    for (const setting of globalState.views[globalState.currentView].settings ?? []) {
        if (obj[setting.property] && globalState.settings[setting.id].state) return true;
    }
};


export const initializeSettings = () => {
    globalState.views[globalState.currentView].settings.forEach(setting => {
        if (globalState.settings[setting.id]) return;

        globalState.settings[setting.id] = setting;
    });

    Object.entries(globalState.settings).forEach(([id, setting]) => {
        if (setting.state === undefined) {
            setting.state = setting.defaultValue ?? false;
        }
        if (setting.id === undefined) {
            setting.id = id;
        }
    });
};