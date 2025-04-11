import { loadSettings } from './core/events.js';
import { drawContent } from './core/render.js';

window.onload = function () {
    loadSettings();
    drawContent();
};