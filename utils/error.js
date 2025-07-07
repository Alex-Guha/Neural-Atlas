import { globalState } from '../utils/state.js'
import { updateReferences } from '../core/sidebar.js';

export function displayError(message) {
    const errorBox = document.getElementById('references');
    errorBox.innerHTML = '';

    errorBox.style.setProperty('background-color', globalState.currentTheme.ERROR_BACKGROUND);
    errorBox.style.setProperty('color', globalState.currentTheme.ERROR_TEXT);

    const lines = message.split('\n');

    const errorHeader = document.createElement('h3');
    errorHeader.textContent = lines[0];
    errorBox.appendChild(errorHeader);

    const errorMessage = document.createElement('div');
    errorMessage.style.marginTop = '10px';

    lines.slice(1).forEach((line, index) => {
        errorMessage.appendChild(document.createTextNode(line));
        if (index < lines.slice(1).length - 1) {
            errorMessage.appendChild(document.createElement('br'));
            errorMessage.appendChild(document.createElement('br'));
        }
    });
    errorBox.appendChild(errorMessage);
}

export function confirmAction(message) {
    return new Promise((resolve) => {
        // Prevent memory leaks if the references box is cleared before an option is selected
        const timeout = setTimeout(() => {
            resolve(false);
            updateReferences();
        }, 30000);

        const confirmationBox = document.getElementById('references');
        confirmationBox.innerHTML = '';

        confirmationBox.style.setProperty('background-color', globalState.currentTheme.ERROR_BACKGROUND);
        confirmationBox.style.setProperty('color', globalState.currentTheme.ERROR_TEXT);

        const lines = message.split('\n');

        const confirmationHeader = document.createElement('h3');
        confirmationHeader.textContent = lines[0];
        confirmationBox.appendChild(confirmationHeader);

        const confirmationMessage = document.createElement('div');
        confirmationMessage.style.marginTop = '10px';

        lines.slice(1).forEach((line, index) => {
            confirmationMessage.appendChild(document.createTextNode(line));
            if (index < lines.slice(1).length - 1) {
                confirmationMessage.appendChild(document.createElement('br'));
                confirmationMessage.appendChild(document.createElement('br'));
            }
        });
        confirmationBox.appendChild(confirmationMessage);

        const confirmButton = document.createElement('button');
        confirmButton.textContent = 'Confirm';
        confirmButton.style.marginTop = 'auto';
        confirmButton.addEventListener('click', () => {
            clearTimeout(timeout);
            resolve(true);
        });
        confirmationBox.appendChild(confirmButton);

        const cancelButton = document.createElement('button');
        cancelButton.textContent = 'Cancel';
        cancelButton.addEventListener('click', () => {
            clearTimeout(timeout);
            resolve(false);
            updateReferences();
        });
        confirmationBox.appendChild(cancelButton);
    });
}