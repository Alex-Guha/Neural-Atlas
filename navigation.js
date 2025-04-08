import { drawContent } from './main.js';
import { createSettings, theme, showViews } from './events.js';
import * as details from './standard_items/details.js';
import * as architectures from './standard_items/architectures.js';
import { resetZoom } from './utils/zoom.js';
import { DEFAULT_VIEW } from './utils/defaults.js';
import { parseArchitecture, parseDetail } from './parser.js';

const navigationLayer = d3.select("#navigation-layer");

// These only store pointers, fortunately
let undoNavigationHistory = [];
let redoNavigationHistory = [];

// Stores views so they don't need to be rebuilt every time
export const views = {}
views[DEFAULT_VIEW] = parseArchitecture(DEFAULT_VIEW);

// Global tracking for the current view
export let currentView = views[DEFAULT_VIEW];

// Handles changing views
export const navigateTo = (view) => {
    if (!views[view]) {
        if (architectures[view])
            views[view] = parseArchitecture(view);
        else if (details[view])
            views[view] = parseDetail(view);
        else {
            console.error(`View ${view} not found.`);
            return;
        }
    }
    undoNavigationHistory.push(currentView);
    redoNavigationHistory = [];
    currentView = views[view];
    drawContent();
};

const navigateBack = () => {
    if (undoNavigationHistory.length > 0) {
        redoNavigationHistory.push(currentView);
        currentView = undoNavigationHistory.pop();
        drawContent();
    }
};

const navigateForward = () => {
    if (redoNavigationHistory.length > 0) {
        undoNavigationHistory.push(currentView);
        currentView = redoNavigationHistory.pop();
        drawContent();
    }
};

export const drawNavigation = () => {
    const svg_paths = {
        back: "M7.5-10-7.5 0l15 10Z",
        forward: "M-7.5-10 7.5 0-7.5 10Z",
        reset: "M0-10A10 10 0 100 10 10 10 0 100-10",
        // https://observablehq.com/@jjhembd/gear-icon-generator
        // https://yqnn.github.io/svg-path-editor/
        settings: "M11 0l-.165 1.914-3.3.539-.803 1.738L8.426 7.073 7.073 8.426 4.191 6.732l-1.738.803-.539 3.3L0 11-1.111 7.854-2.959 7.359-5.5 9.526l-1.573-1.1 1.177-3.124-1.1-1.573-3.344.033-.495-1.848L-7.92.264-7.755-1.639-10.34-3.762-9.526-5.5l3.289.616L-4.884-6.237-5.5-9.526-3.762-10.34-1.639-7.755.264-7.92l1.65-2.915 1.848.495-.033 3.344 1.573 1.1L8.426-7.073 9.526-5.5 7.359-2.959l.495 1.848zM5.5 0a5.5 5.5 90 100 .0154z",
        dropdown: "M9 .375c.75 0 .75-.75 0-.75H-9c-.75 0-.75.75 0 .75Zm-18-7c-.75 0-.75-.75 0-.75H9c.75 0 .75.75 0 .75Zm0 13.25c-.75 0-.75.75 0 .75H9c.75 0 .75-.75 0-.75Z",

    };

    navigationLayer.selectAll('.nav-button').remove();
    drawButton('views-button', 0, svg_paths.dropdown, (event) => showViews(event), true);
    drawButton('back-button', 50, svg_paths.back, () => navigateBack(), undoNavigationHistory.length > 0);
    drawButton('forward-button', 100, svg_paths.forward, () => navigateForward(), redoNavigationHistory.length > 0);
    drawButton('reset-button', 150, svg_paths.reset, resetZoom, true);
    drawButton('settings-button', 200, svg_paths.settings, (event) => createSettings(event), true);
};

function drawButton(id, x, shape, clickHandler, isEnabled) {
    const group = navigationLayer.append('g')
        .attr('class', 'nav-button')
        .attr('id', id)
        .attr('transform', `translate(${x + 5}, 5)`)
        .style('cursor', isEnabled ? 'pointer' : 'default');

    // Prevent dragging when hovering over the button
    group.on('mousedown', (event) => event.stopPropagation());

    // Button background
    group.append('rect')
        .attr('width', 40)
        .attr('height', 40)
        .attr('rx', 5)
        .attr('ry', 5)
        .attr('fill', isEnabled ? theme.BUTTON_FILL : theme.DISABLED_BUTTON_FILL)
        .attr('stroke', isEnabled ? theme.BUTTON_STROKE : theme.DISABLED_BUTTON_STROKE);

    // Button icon
    group.append('path')
        .attr('d', shape)
        .attr('fill', 'none')
        .attr('stroke', isEnabled ? theme.BUTTON_ARROW : theme.DISABLED_BUTTON_ARROW)
        .attr('stroke-width', id === 'settings-button' ? 1.2 : id === 'views-button' ? 1 : 2)
        .attr('stroke-linecap', 'round')
        .attr('stroke-linejoin', 'round')
        .attr('transform', 'translate(20, 20)');

    // Future QoL: make the settings and views buttons mouseover behavior persist when the button has been clicked (i.e. when the settings or views menu is open), and reset when the resetSidebar event is called
    if (isEnabled) {
        group.on('click', clickHandler);

        // Hover effect
        group.on('mouseover', function () {
            d3.select(this).select('rect').attr('fill', theme.BUTTON_HOVER_FILL);
            d3.select(this).select('path').attr('stroke', theme.BUTTON_HOVER_ARROW);
            id === 'settings-button' || id === 'views-button' ? d3.select(this).select('path').attr('fill', theme.BUTTON_HOVER_ARROW) : null;
        });

        group.on('mouseout', function () {
            d3.select(this).select('rect').attr('fill', theme.BUTTON_FILL);
            if (id === 'settings-button' || id === 'views-button') {
                d3.select(this).select('path').attr('fill', 'none');
            } else {
                d3.select(this).select('path').attr('stroke', theme.BUTTON_ARROW);
            }
        });
    }
}
