import { globalState } from '../utils/state.js'

import * as details from '../standard_items/details.js';
import * as components from '../standard_items/components.js';
import * as architectures from '../standard_items/architectures.js';

// Parses architectures (abstract definitions of Details) and creates the corresponding view
export function parseArchitecture(architectureName) {
    const architectureDetails = {
        settings: [],
        references: [],
        content: {},
    }

    if (!architectures[architectureName]) {
        console.error(`Architecture ${architectureName} not found.`);
        return architectureDetails;
    }

    globalState.viewStructure = {};
    globalState.viewStructure[architectureName] = [];

    Object.entries(architectures[architectureName]).forEach(([componentID, swapModules]) => {
        buildComponent(componentID, architectureDetails, architectureName, undefined, swapModules);
    });
    return architectureDetails;
}

// Parses Details and creates the corresponding view
// Essentially a reduced version of buildComponent
export function parseDetail(detailName) {
    const targetDetail = details[detailName];
    if (!targetDetail) {
        console.error(`Detail ${detailName} not found.`);
        return null;
    }

    const detail = {
        settings: (targetDetail.settings ?? []),
        references: (targetDetail.references ?? []),
        content: {},
    }

    globalState.viewStructure[detailName] = [];

    const idMap = {};

    Object.entries(targetDetail.content).forEach(([itemID, item]) => {
        if (item.component) {
            buildComponent(item.component, detail, detailName);
        } else {
            const newItemID = `${itemID}`;
            let i = 1;
            while (detail.content[newItemID]) {
                newItemID = `${itemID}_${i}`;
                i++;
            }
            idMap[itemID] = newItemID;

            detail.content[newItemID] = item;

            if (detail.content[newItemID].previous) detail.content[newItemID].previous = idMap[item.previous];

            if (item.details) {
                globalState.viewStructure[detailName].push(item.details);
                globalState.views[item.details] = parseDetail(item.details);
            }
        }
    });

    return detail;
}

// Recursively builds the component and adds it to viewDetails. Used for both architectures and details.
function buildComponent(componentID, viewDetails, viewName, parentComponentChain = [], swapModules = null) {
    const targetComponent = components[componentID];
    if (!targetComponent) {
        console.error(`Component ${componentID} not found.`);
        return;
    }

    // Prevents recursive definition loops, either as self-references or cyclical references
    if (parentComponentChain.includes(componentID)) {
        console.error(`Cyclical reference detected in component ${componentID}.`);
        return;
    }
    const componentChain = [...parentComponentChain, componentID];

    // Because we change item id, we need to also change any future references to it
    // So, we map the old id to the new id, and update the previous property if it exists
    const idMap = {};

    // Stitch together content
    Object.entries(targetComponent.content).forEach(([itemID, item], index) => {
        // If the item is a component, we need to build it recursively
        if (item.component) {
            const componentClass = item.class;

            // If there are swappable modules specified in the architecture, and the component is swappable
            if (swapModules && componentClass) {
                const swapComponent = swapModules[componentClass];
                // check if the swappable modules has a swap for this component
                if (swapComponent) {
                    buildComponent(
                        swapComponent.at(0),
                        viewDetails,
                        viewName,
                        componentChain,
                        swapModules = swapComponent.at(1)
                    );
                    return;
                }
            }

            // Architecture did not specify a swap or this component is not swappable, build normally
            buildComponent(item.component, viewDetails, viewName, componentChain);
            return;
        }

        // Allows for different components to use the same id for two items
        const newItemID = `${componentID}_${itemID}`;

        // Handles when newItemID already exists in viewDetails.content, i.e. if a component is used multiple times in different locations
        let i = 1;
        while (viewDetails.content[newItemID]) {
            newItemID = `${componentID}_${i}_${itemID}`;
            i++;
        }

        idMap[itemID] = newItemID;

        viewDetails.content[newItemID] = item;

        // point the first element being added here to the last element in the previous component using 'previous'
        if (index === 0 && Object.keys(viewDetails.content).length > 1) {
            if (viewDetails.content[newItemID].previous) console.log(`Warning: First item ${itemID} in ${componentID} had a previous element`);
            viewDetails.content[newItemID].previous = Object.keys(viewDetails.content).at(-2);
        } else if (viewDetails.content[newItemID].previous)
            viewDetails.content[newItemID].previous = idMap[item.previous];

        if (item.details) {
            globalState.viewStructure[viewName].push(item.details);
            globalState.views[item.details] = parseDetail(item.details);
        }
    });

    viewDetails.settings.push(
        ...(components[componentID].settings ?? []).filter(
            (newSetting) => !viewDetails.settings.some((existingSetting) => existingSetting.id === newSetting.id)
        )
    );
    viewDetails.references.push(
        ...(components[componentID].references ?? []).filter(
            (newReference) => !viewDetails.references.some((existingReference) => existingReference.title === newReference.title)
        )
    );
}