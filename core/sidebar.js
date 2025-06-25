import { navigateTo } from '../core/navigation.js';

import { globalState } from '../utils/state.js'

// Attach a click listener to the background (SVG) to reset the sidebar
d3.select('#svg').on('click', resetSidebar);

// Resets the sidebar to its default state
export function resetSidebar() {
    globalState.sidebarPersistent = false;
    updateInfo('');
    updateReferences();

    // QoL: Clear any accidental highlights
    if (window.getSelection) {
        const selection = window.getSelection();
        if (selection) selection.removeAllRanges();
    } else if (document.selection) {
        document.selection.empty();
    }
}

// Updates the sidebar with information from the hovered element
export function updateSidebar(event) {
    const target = event.currentTarget;

    // If the element has references, change the references box
    updateReferences(target.getAttribute('data-references') || null);

    // For any updateSidebar call aside from the reference list items (i.e. on hovering over elements in the svg)
    // Populate the info box with data from the element
    updateInfo(target.getAttribute('data-info') || "No additional information.");
}

// Handles hovering over items in the reference box
export function attachReferenceEventListeners(element) {
    let originalContent = null;

    element.on('mouseover', (event) => {
        // Save the current state of the info box
        const infoBox = document.getElementById('info');
        originalContent = infoBox.innerHTML;

        // Render reference data in the info box regardless of persistent state
        updateInfo(event.currentTarget.dataset.info);
    })
        .on('mouseout', () => {
            // Restore the original content of the info box
            if (originalContent !== null) {
                document.getElementById('info').innerHTML = originalContent;
                originalContent = null;
            }
        })
        .style('cursor', 'pointer');
}

// Handles items with details (double-clickable items)
export function attachDetailEventListeners(element) {
    element.on('dblclick touchend', (event) => {
        event.stopPropagation();
        globalState.sidebarPersistent = false;

        // Handle touch events for mobile devices
        if (event.type === 'touchend') {
            const now = Date.now();
            const timeSinceLastTouch = now - (element._lastTouch || 0);
            element._lastTouch = now;

            // If the time between two touch events is less than 300ms, treat it as a double-tap
            if (timeSinceLastTouch < 300) {
                navigateTo(element.attr('data-details'));
            }
        } else {
            navigateTo(element.attr('data-details'));
        }
    })
        .style('cursor', 'pointer');
}

// Generic event listener for updating the sidebar
export function attachElementEventListeners(element) {
    element.on('mouseover', (event) => {
        if (!globalState.sidebarPersistent) updateSidebar(event);
    })
        .on('click', (event) => {
            event.stopPropagation(); // Prevent the background click
            globalState.sidebarPersistent = true;
            updateSidebar(event);
        })
        .on('mouseout', () => {
            if (!globalState.sidebarPersistent) resetSidebar();
        })
        .style('cursor', 'pointer');
}

// Creates the references box
export function updateReferences(elementReferences = null) {
    const referencesList = document.getElementById('references-list');
    referencesList.innerHTML = '';

    const refsToRender = JSON.parse(elementReferences) || globalState.views[globalState.currentView].references;

    if (refsToRender) {
        refsToRender.forEach(ref => {
            const li = document.createElement('li');
            const a = document.createElement('a');

            a.href = ref.link || '#';
            a.target = "_blank";
            a.textContent = (ref.title || 'Untitled') + (ref.refType ? ` (${ref.refType})` : '');
            a.dataset.info =
                (ref.title ? `**Reference Name:** ${ref.title}\n\n` : '') +
                (ref.info ? `**Description:** ${ref.info}\n\n` : '') +
                (ref.authors && ref.authors.length ? `**Authors:**\n${ref.authors.map(a => `• ${a}`).join('\n')}\n\n` : '') +
                (ref.refType ? `**Link type:** ${ref.refType}\n\n` : '');

            attachReferenceEventListeners(d3.select(a));

            li.appendChild(a);
            referencesList.appendChild(li);
        });
    }
}

// Creates the info box
export function updateInfo(content) {
    const element = document.getElementById('info');
    element.textContent = "";

    // Replace placeholders with architecture property values
    content = replacePlaceholders(content, globalState.currentProperties || {});

    let currentIndex = 0;

    while (currentIndex < content.length) {
        if (content.startsWith('$$', currentIndex)) {
            currentIndex = handleLaTeXContent(content, currentIndex, element);
        } else if (content.startsWith('**', currentIndex)) {
            currentIndex = handleBoldContent(content, currentIndex, element);
        } else {
            currentIndex = handlePlainText(content, currentIndex, element);
        }
    }
}

// Helper function to replace {{property}} placeholders with values from architecture properties
function replacePlaceholders(text, properties) {
    const templateRegex = /\{\{([^}|]+)(\|([^}]+))?\}\}/g;
    return text.replace(templateRegex, (_, propName, _defaultPart, defaultValue) => {
        return properties.hasOwnProperty(propName) ? properties[propName] : (defaultValue ?? '');
    });
}

function handleLaTeXContent(content, currentIndex, element) {
    const endIndex = content.indexOf('$$', currentIndex + 2);
    if (endIndex === -1) {
        console.error('Unclosed LaTeX at position', currentIndex);
        return content.length;
    }
    const latexContent = content.slice(currentIndex + 2, endIndex);
    const span = document.createElement('span');
    katex.render(latexContent, span, {
        throwOnError: false,
        displayMode: false
    });
    element.appendChild(span);
    return endIndex + 2;
}

function handleBoldContent(content, currentIndex, element) {
    const endIndex = content.indexOf('**', currentIndex + 2);
    if (endIndex === -1) {
        console.error('Unclosed bold at position', currentIndex);
        return content.length;
    }
    const boldContent = content.slice(currentIndex + 2, endIndex);
    const strong = document.createElement('strong');
    strong.textContent = boldContent;
    element.appendChild(strong);
    return endIndex + 2;
}

function handlePlainText(content, currentIndex, element) {
    const nextSpecialChar = Math.min(
        content.indexOf('$$', currentIndex) === -1 ? Infinity : content.indexOf('$$', currentIndex),
        content.indexOf('**', currentIndex) === -1 ? Infinity : content.indexOf('**', currentIndex)
    );
    const textContent = content.slice(currentIndex, nextSpecialChar === Infinity ? undefined : nextSpecialChar);
    const lines = textContent.split('\n');
    lines.forEach((line, index) => {
        element.appendChild(document.createTextNode(line));
        if (index < lines.length - 1) {
            element.appendChild(document.createElement('br'));
        }
    });
    return nextSpecialChar === Infinity ? content.length : nextSpecialChar;
}