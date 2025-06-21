
import { globalState } from '../utils/state.js'

// Handles the click event for the views menu button
export const showViews = (event) => {
    event.stopPropagation();
    globalState.sidebarPersistent = true;

    const infoElement = document.getElementById('info');
    infoElement.innerHTML = '';

    // Create a title for the view tree
    const title = document.createElement('div');
    title.textContent = 'View Structure';
    title.style.marginBottom = '10px';
    title.style.fontSize = '1.2em';
    infoElement.appendChild(title);

    // Create a container for the tree
    const treeContainer = document.createElement('div');
    treeContainer.className = 'view-tree';

    // Future TODO
    // This logic is a bit overkill right now, since the root view will always be the first one in globalState.viewStructure
    // But, when we add more architectures and expand the view navigator, this might be useful

    // Find root views (those that don't appear as children in any other view)
    const allChildViews = new Set();
    Object.values(globalState.viewStructure).forEach(children => {
        children.forEach(child => allChildViews.add(child));
    });

    const rootViews = Object.keys(globalState.viewStructure).filter(view => !allChildViews.has(view));

    // If no root views are found, use all parent views
    const startViews = rootViews.length > 0 ? rootViews : Object.keys(globalState.viewStructure);

    // Build the tree structure
    startViews.forEach(view => {
        const viewItem = buildViewTree(view);
        treeContainer.appendChild(viewItem);
    });

    infoElement.appendChild(treeContainer);
};

// TODO work on the UI for this a bit
// Helper function to build the tree structure recursively
function buildViewTree(viewName) {
    const viewContainer = document.createElement('div');
    viewContainer.className = 'view-container';

    const viewRow = document.createElement('div');
    viewRow.className = 'view-item';
    viewRow.style.display = 'flex';

    // Create expand/collapse icon if view has children
    if (globalState.viewStructure[viewName] && globalState.viewStructure[viewName].length > 0) {
        const expandIcon = document.createElement('span');
        expandIcon.className = 'expand-icon';
        expandIcon.textContent = '▶';
        expandIcon.style.cursor = 'pointer';
        expandIcon.style.marginTop = '2px';
        expandIcon.style.marginRight = '5px';
        expandIcon.style.color = globalState.currentTheme.TEXT_COLOR;
        expandIcon.style.fontSize = '0.8em';
        expandIcon.style.transition = 'transform 0.2s';

        // Create the children container
        const childrenContainer = document.createElement('div');
        childrenContainer.className = 'view-children';
        childrenContainer.style.paddingLeft = '15px';
        childrenContainer.style.display = 'none';

        // Build child views
        globalState.viewStructure[viewName].forEach(childView => {
            const childItem = buildViewTree(childView, globalState.viewStructure);
            childrenContainer.appendChild(childItem);
        });

        // Add click handler for expand/collapse
        expandIcon.addEventListener('click', (e) => {
            e.stopPropagation();
            const isExpanded = childrenContainer.style.display !== 'none';
            childrenContainer.style.display = isExpanded ? 'none' : 'block';
            expandIcon.style.transform = isExpanded ? 'rotate(0deg)' : 'rotate(90deg)';
        });

        viewRow.appendChild(expandIcon);
        viewContainer.appendChild(viewRow);
        viewContainer.appendChild(childrenContainer);
    } else {
        // Add spacing for leaf nodes (views with no children)
        const spacer = document.createElement('span');
        spacer.style.width = '0.8em';
        viewRow.appendChild(spacer);
        viewContainer.appendChild(viewRow);
    }

    // Create the view name element
    const viewLabel = document.createElement('span');
    viewLabel.textContent = viewName;
    viewLabel.style.cursor = 'pointer';

    // Add click handler to navigate to view
    viewLabel.addEventListener('click', () => {
        navigateTo(viewName);
    });

    viewRow.appendChild(viewLabel);

    return viewContainer;
}