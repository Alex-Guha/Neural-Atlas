import { globalState } from '../utils/state.js';

const content = d3.select("#content");

/**
 * Draws text relative the item.
 * The first word in the text's position property is the arrangement relative to the center of the item. 'top' is default.
 * The second is relative to the side of the item. 'center' is default.
 * Example: 'top-left', 'bottom-right', 'center'.
 */
export function drawText(item) {
    if (!Array.isArray(item.text))
        item.text = [item.text];

    item.text.forEach(textObject => {

        // Don't render the text if it's been toggled off
        for (const setting of globalState.currentView.settings ?? []) {
            if (textObject[setting.property] && globalState.currentSettings[setting.id]) return;
        }

        // Using architecture specific properties, replace any {{property}} placeholders in the text with the corresponding property.
        let foundProps = false;
        Object.entries(globalState.currentProperties).forEach(([prop, value]) => {
            if (textObject[prop]) {
                if (textObject.latexText)
                    textObject.latexText = textObject.latexText.replaceAll(`{{${prop}}}`, value);
                else
                    textObject.text = textObject.text.replaceAll(`{{${prop}}}`, value);
                foundProps = true;
                return;
            }
        });
        // If no properties were found and there's a default value, replace any remaining template patterns
        if (!foundProps && textObject.default !== undefined) {
            // Find and replace any remaining {{...}} placeholders with the default value
            const templateRegex = /\{\{([^}]+)\}\}/g;
            if (textObject.latexText)
                textObject.latexText = textObject.latexText.replace(templateRegex, textObject.default);
            else
                textObject.text = textObject.text.replace(templateRegex, textObject.default);
        }

        // Handle latex differently than normal text
        let label = textObject.latexText ? createLatexLabel(textObject) : createTextLabel(textObject);

        // Set the base position of the text, before relative positioning
        const textObjectX = item.x + (item.xSpacing ? item.xSpacing * (item.count - 1) / 2 : 0) + (textObject.xOffset ?? 0);
        const textObjectY = item.y + (textObject.yOffset ?? 0);
        label.setAttribute('x', textObjectX);
        label.setAttribute('y', textObjectY);

        // Makes these properties hierarchical. textObject > item > nonexistent
        ['info', 'details', 'references'].forEach(key => {
            if (textObject[key] || item[key]) {
                label.dataset[key] = key === 'references'
                    ? JSON.stringify(textObject[key] ?? item[key])
                    : textObject[key] ?? item[key];
            }
        });

        // Render the text
        content.append(() => (label));

        // After rendering, use the text's hieght and width to position it correctly relative to the item
        setTimeout(() => {
            const bbox = label.getBBox();
            let adjustedX = textObjectX;
            let adjustedY = textObjectY;
            const height = item.height;
            const width = item.width;

            // top-center is default
            // the first word is the arrangement relative to the center of the box
            const relativeToCenter = textObject.position ? textObject.position.split('-')[0] : 'top';
            // the second is relative to the side of the box that the text is on
            const relativeToSide = textObject.position ? textObject.position.split('-')[1] || 'center' : 'center';

            if (['right', 'left'].includes(relativeToCenter)) {
                adjustedX += xAlign(relativeToCenter, width, bbox, textObject.latexText);
                adjustedY += ySide(relativeToSide, height, bbox, textObject.latexText);
            } else {
                adjustedX += xSide(relativeToSide, width, bbox, textObject.latexText);
                adjustedY += yAlign(relativeToCenter, height, bbox, textObject.latexText);
            }

            label.setAttribute('x', adjustedX);
            label.setAttribute('y', adjustedY);
        }, 0);
    });
}

// The +/-5 in any of these is just a little padding

function xAlign(pos, width, bbox, latex) {
    switch (pos) {
        case 'left': return -bbox.width - (latex ? 10 : 5);
        case 'right': return width + (latex ? 10 : 5);
        default: return width / 2 - bbox.width / 2;
    }
}

function yAlign(pos, height, bbox, latex) {
    switch (pos) {
        case 'top': return - bbox.height / (latex ? 1 : 2) - (latex ? 5 : 0);
        case 'bottom': return height + (latex ? 0 : bbox.height) + (latex ? 5 : 0);
        default: return height / 2 + bbox.height / (latex ? -2 : 4);
    }
}

function xSide(pos, width, bbox, latex) {
    switch (pos) {
        case 'left': return 0;
        case 'right': return width - bbox.width;
        default: return width / 2 - bbox.width / 2;
    }
}

function ySide(pos, height, bbox, latex) {
    switch (pos) {
        case 'top': return latex ? 0 : bbox.height / 2 + 1; // Extra +1 for normal text, they have weird bboxes
        case 'bottom': return height - (latex ? bbox.height : 0);
        default: return height / 2 + bbox.height / (latex ? -2 : 4);
    }
}

// Occasionally, the latex text is clipped on the left and right sides a little bit, not sure why.
// Handled with overflow: visible for now, but it causes a little bit of positioning issues.
function createLatexLabel(textObject) {
    const foreignObject = document.createElementNS('http://www.w3.org/2000/svg', 'foreignObject');
    foreignObject.setAttribute('overflow', 'visible');

    const div = document.createElement('div');
    div.style.fontSize = '18px';
    div.style.color = colorSwitch(textObject.color);

    // The width and height of LaTeX needs to be set directly, so we need to measure it first
    div.style.display = 'inline-block';
    div.style.visibility = 'hidden';
    div.style.whiteSpace = 'nowrap';
    document.body.appendChild(div);
    katex.render(textObject.latexText, div, { throwOnError: true });
    const { width, height } = div.getBoundingClientRect();
    document.body.removeChild(div);

    foreignObject.setAttribute('width', Math.ceil(width));
    foreignObject.setAttribute('height', Math.ceil(height));

    div.style.visibility = 'visible';
    div.style.display = 'flex';
    div.style.justifyContent = 'center';
    div.style.alignItems = 'center';
    div.style.height = '100%';

    foreignObject.appendChild(div);

    return foreignObject;
}

function createTextLabel(textObject) {
    const textElement = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    textElement.setAttribute('fill', colorSwitch(textObject.color));
    textElement.textContent = textObject.text;

    return textElement;
}

// Helper that first looks for an integer between 1 and 4 to lookup the color in the globalState.currentTheme, then falls back to assuming the color has been overridden and specified directly.
function colorSwitch(color) {
    return color
        ? (typeof color === 'number' && color >= 1 && color <= 4
            ? globalState.currentTheme.TEXT_COLOR[color - 1]
            : color
        ) : globalState.currentTheme.TEXT_COLOR[0];
}