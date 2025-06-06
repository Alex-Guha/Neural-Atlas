import { attachElementEventListeners, attachDetailEventListeners, resetSidebar } from './events.js';
import { drawNavigation } from './navigation.js';
import { drawSubcomponent } from '../drawingUtils/shapes.js';
import { drawConnection } from '../drawingUtils/arrows.js';
import { drawText } from '../drawingUtils/text.js';
import { resetZoom } from '../utils/zoom.js';

import * as DEFAULTS from '../utils/defaults.js';
import { globalState } from '../utils/state.js'

const content = d3.select("#content");

// Local State Variable
let currentRenderId = 0;

// Central function for updating the view
export const drawContent = () => {
    currentRenderId++;
    const renderId = currentRenderId;

    globalState.allSettings = globalState.currentView.settings
        ? globalState.currentSettings.concat(globalState.currentView.settings)
        : globalState.currentSettings;
    globalState.allSettings.forEach(setting => {
        globalState.currentSettings[setting.id] = globalState.currentSettings[setting.id] ?? setting.defaultValue ?? false;
    });

    content.selectAll('*').remove();

    resetZoom();
    drawNavigation();
    resetSidebar();
    renderElements(renderId);
};

// Iterates through the view and renders each element
function renderElements(renderId) {
    const elements = globalState.currentView.content;
    if (!elements) return;

    let delay = 0;
    let delayAmount = 0;

    // Fun setting for showing the graph generation
    if (globalState.currentSettings['rendering-delay']) {
        // ensures that it takes the same amount of time to render a few elements as it does to render many
        delayAmount = Math.max(-0.25 * Object.keys(elements).length + 32.5, 0);
    }

    Object.values(elements).forEach(item => {
        setTimeout(() => {
            if (renderId !== currentRenderId) return;
            if (item.previous && !elements[item.previous]) return;

            for (const setting of globalState.currentView.settings ?? []) {
                if (item[setting.property] && globalState.currentSettings[setting.id]) return;
            }

            // Calculate the position of the item only on the first render
            if (!item.calculated) {
                if (item.references && typeof item.references !== 'string') item.references = JSON.stringify(item.references);

                // Set defaults if not specified
                item.width = (item.width ?? DEFAULTS.SHAPE.width);
                item.height = (item.height ?? DEFAULTS.SHAPE.height);
                item.xSpacing = (item.xSpacing ?? (item.count ? DEFAULTS.SHAPE.width / 4 : 0));
                item.ySpacing = (item.ySpacing ?? (item.count ? -DEFAULTS.SHAPE.height / 16 : 0));

                const previousAbsolutePosition = item.previous ? elements[item.previous] : { x: 0, y: 0 };
                const currentAbsolutePosition = { x: previousAbsolutePosition.x, y: previousAbsolutePosition.y };

                // Calculate the the absolute position of the item based on the previous item
                // The ternaries handle when it's the first item (i.e. previousAbsolutePosition.width/height is undefined)
                // "item._ ??" allows the user to override the default value if they want, but it generally shouldn't be done
                switch (item.position) {
                    case 'above':
                        currentAbsolutePosition.x += (item.x ?? 0);
                        currentAbsolutePosition.y += (item.y ?? (previousAbsolutePosition.height ? - item.height - (item.separation ?? DEFAULTS.SHAPE.separation) : (item.separation ?? 0)));
                        break;
                    case 'below':
                        currentAbsolutePosition.x += (item.x ?? 0);
                        currentAbsolutePosition.y += (item.y ?? (previousAbsolutePosition.height ? previousAbsolutePosition.height + (item.separation ?? DEFAULTS.SHAPE.separation) : (item.separation ?? 0)));
                        break;
                    case 'left':
                        currentAbsolutePosition.x += (item.x ?? (previousAbsolutePosition.width ? - item.width - (item.separation ?? DEFAULTS.SHAPE.separation) : (item.separation ?? 0)));
                        currentAbsolutePosition.y += (item.y ?? (previousAbsolutePosition.height ? previousAbsolutePosition.height / 2 - item.height / 2 : 0));
                        break;
                    default: // Default to right positioning
                        currentAbsolutePosition.x += (item.x ?? (previousAbsolutePosition.width ? previousAbsolutePosition.width + (item.separation ?? DEFAULTS.SHAPE.separation) : (item.separation ?? 0)));
                        // For right positioning, calculate y using centers of previous and item.
                        currentAbsolutePosition.y += (item.y ?? (previousAbsolutePosition.height ? previousAbsolutePosition.height / 2 - item.height / 2 : 0));
                        break;
                }

                // Update the item position now that it's been calculated
                item.x = currentAbsolutePosition.x;
                item.y = currentAbsolutePosition.y;
                item.calculated = true;
            }

            // Draw the shape. All items normally have a shape, but it's not enforced, in case a user wants to be creative
            if (item.shape) drawSubcomponent(item);

            // Draw the arrow(s). Unlike text, this is iterated over here because the arrows may have a different previous item specified than item does.
            if (Array.isArray(item.arrow) && item.arrow.length > 0) {
                for (const arrow of item.arrow)
                    drawConnection(arrow, (arrow.previous ? elements[arrow.previous] : elements[item.previous]), item);
            } else if (item.arrow) drawConnection(item.arrow, (item.arrow.previous ? elements[item.arrow.previous] : elements[item.previous]), item);

            // Draw the text
            if (item.text) drawText(item);

            // Attach event listeners after rendering
            content.selectAll('[data-info], [data-references]').each(function () {
                attachElementEventListeners(d3.select(this));
            });
            content.selectAll('[data-details]').each(function () {
                attachDetailEventListeners(d3.select(this));
            });
        }, delay);

        delay += delayAmount;
    });
}
