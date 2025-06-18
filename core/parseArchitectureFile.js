/*
import { parseArchitectureFile } from './parseArchitecture.js';

parseArchitectureFile('../standard_items/architectures.txt')
    .then(architecture => {
        console.log(architecture);
    })
    .catch(error => {
        console.error('Error parsing architecture:', error);
    });
*/

export function parseArchitectureFile(filePath) {
    return new Promise((resolve, reject) => {
        fetch(filePath)
            .then(response => response.text())
            .then(content => {
                try {
                    const parsedArchitecture = parseArchitectureContent(content);
                    resolve(parsedArchitecture);
                } catch (error) {
                    reject(error);
                }
            })
            .catch(error => reject(error));
    });
}

function parseArchitectureContent(content) {
    // Split content into lines and remove empty lines
    const lines = content.split('\n')
        .map(line => line.trimEnd())
        .filter(line => line.trim().length > 0);

    if (lines.length === 0) {
        throw new Error('Empty architecture definition');
    }

    // Find the starting indices of each architecture
    const architectureStartIndices = findArchitectureStartIndices(lines);

    // Parse each architecture
    const result = {};

    for (let i = 0; i < architectureStartIndices.length; i++) {
        const startIndex = architectureStartIndices[i];
        const endIndex = i < architectureStartIndices.length - 1
            ? architectureStartIndices[i + 1]
            : lines.length;

        const architectureLines = lines.slice(startIndex, endIndex);
        const parsedArchitecture = parseArchitectureSection(architectureLines);

        // Merge into result
        Object.assign(result, parsedArchitecture);
    }

    return result;
}

function findArchitectureStartIndices(lines) {
    const indices = [];

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        // An architecture definition starts with a name followed by a colon
        // and is either at the beginning of the file or after a blank line
        if (line.endsWith(':') && (i === 0 || countIndent(lines[i]) === 0)) {
            indices.push(i);
        }
    }

    return indices;
}

function parseArchitectureSection(lines) {
    if (lines.length === 0) {
        throw new Error('Empty architecture section');
    }

    // Extract architecture name from first line
    const firstLine = lines[0];
    if (!firstLine.endsWith(':')) {
        throw new Error('Architecture definition must start with a name followed by a colon');
    }

    const architectureName = firstLine.slice(0, -1).trim();

    // Parse the architecture structure
    const architecture = {};
    const stack = [{ obj: architecture, indent: -1 }];

    let i = 1;
    while (i < lines.length) {
        const line = lines[i];
        const indent = countIndent(line);
        const content = line.trim();

        // Find the appropriate parent in the stack
        while (stack.length > 1 && stack[stack.length - 1].indent >= indent) {
            stack.pop();
        }

        const parent = stack[stack.length - 1].obj;

        // Handle special sections
        if (content === 'references:') {
            const [refSection, newIndex] = parseReferencesSection(lines, i, indent);
            parent.references = refSection;
            i = newIndex;
            continue;
        } else if (content === 'properties:') {
            const [propsSection, newIndex] = parsePropertiesSection(lines, i, indent);
            parent.properties = propsSection;
            i = newIndex;
            continue;
        } else if (content.endsWith(':')) {
            // This is a component with children
            const componentName = content.slice(0, -1).trim();
            parent[componentName] = {};
            stack.push({ obj: parent[componentName], indent });
        } else if (content.includes(':')) {
            // This is a class component (className: componentName)
            const [className, componentName] = content.split(':').map(part => part.trim());

            // Check if the next line has a greater indent (indicating nested components)
            const hasChildren = (i + 1 < lines.length) && (countIndent(lines[i + 1]) > indent);

            if (hasChildren) {
                parent[className] = [componentName, {}];
                stack.push({ obj: parent[className][1], indent });
            } else {
                parent[className] = [componentName, null];
            }
        } else {
            // This is a simple component
            parent[content] = null;
        }

        i++;
    }

    return { [architectureName]: architecture };
}

/**
 * Parse references section into an array of reference objects
 * @param {string[]} lines All lines in the file
 * @param {number} startIndex Start index of the references section
 * @param {number} sectionIndent Indentation level of the references section
 * @returns {[Array, number]} Array of reference objects and the new line index
 */
function parseReferencesSection(lines, startIndex, sectionIndent) {
    const references = [];
    let i = startIndex + 1;

    while (i < lines.length) {
        const line = lines[i];
        const indent = countIndent(line);

        // If we encounter a line with same or less indent than the section,
        // we've reached the end of the references section
        if (indent <= sectionIndent) {
            break;
        }

        // Title lines have one level more indent than the section and end with colon
        if (indent === sectionIndent + 4 && line.trim().endsWith(':')) {
            // Extract reference title (remove quotes and colon)
            let title = line.trim();
            if (title.endsWith(':')) {
                title = title.slice(0, -1).trim();
            }
            if (title.startsWith('"') && title.endsWith('"')) {
                title = title.slice(1, -1);
            }

            // Parse reference properties
            const [reference, newIndex] = parseReferenceProperties(lines, i + 1, indent);
            reference.title = title;
            references.push(reference);
            i = newIndex;
        } else {
            i++;
        }
    }

    return [references, i];
}

/**
 * Parse properties section into an object
 * @param {string[]} lines All lines in the file
 * @param {number} startIndex Start index of the properties section
 * @param {number} sectionIndent Indentation level of the properties section
 * @returns {[Object, number]} Properties object and the new line index
 */
function parsePropertiesSection(lines, startIndex, sectionIndent) {
    const properties = {};
    let i = startIndex + 1;

    while (i < lines.length) {
        const line = lines[i];
        const indent = countIndent(line);

        // If we encounter a line with same or less indent than the section,
        // we've reached the end of the properties section
        if (indent <= sectionIndent) {
            break;
        }

        const content = line.trim();

        // Check for property lines (property: value)
        if (content.includes(':')) {
            const [property, ...valueParts] = content.split(':');
            const propName = property.trim();
            let value = valueParts.join(':').trim();

            // Convert numeric values to actual numbers
            if (!isNaN(value) && value !== '') {
                // Check if it's a float or integer
                if (value.includes('.')) {
                    properties[propName] = parseFloat(value);
                } else {
                    properties[propName] = parseInt(value, 10);
                }
            } else {
                // Handle quoted values
                if (value.startsWith('"') && value.endsWith('"')) {
                    value = evaluateEscapeSequences(value.slice(1, -1));
                }
                properties[propName] = value;
            }
        }

        i++;
    }

    return [properties, i];
}

/**
 * Parse properties of a single reference
 * @param {string[]} lines All lines in the file
 * @param {number} startIndex Start index of the reference properties
 * @param {number} titleIndent Indentation level of the reference title
 * @returns {[Object, number]} Reference object and the new line index
 */
function parseReferenceProperties(lines, startIndex, titleIndent) {
    const reference = {};
    let i = startIndex;

    while (i < lines.length) {
        const line = lines[i];
        const indent = countIndent(line);

        // If we encounter a line with same or less indent than the title,
        // we've reached the end of this reference
        if (indent <= titleIndent) {
            break;
        }

        const content = line.trim();

        // Check for property lines (property: value)
        if (content.includes(':')) {
            const [property, ...valueParts] = content.split(':');
            const propName = property.trim();
            let value = valueParts.join(':').trim();

            // Handle quoted values
            if (value.startsWith('"') && value.endsWith('"')) {
                value = value.slice(1, -1);

                // Check for multi-line strings
                if (i + 1 < lines.length && countIndent(lines[i + 1]) > indent) {
                    const [multilineValue, newIndex] = parseMultilineString(lines, i + 1, indent);
                    value += multilineValue;
                    i = newIndex - 1; // -1 because we'll increment i at the end of the loop
                }

                // Process escape sequences in the string
                value = evaluateEscapeSequences(value);
                reference[propName] = value;
            } else if (propName === 'authors' || propName === 'refType') {
                // Handle authors (will be parsed as array in the next iterations)
                if (propName === 'authors') {
                    reference[propName] = [];
                } else {
                    // For refType, just store the value
                    reference[propName] = value;
                }
            } else {
                reference[propName] = value;
            }
        } else if (indent > titleIndent + 4) {
            // This is likely an array item (like an author)
            // Find the parent property in the reference
            if (reference.authors && indent > titleIndent + 4) {
                reference.authors.push(content);
            }
        }

        i++;
    }

    return [reference, i];
}

/**
 * Evaluate escape sequences in a string
 * @param {string} str The string with escape sequences
 * @returns {string} String with evaluated escape sequences
 */
function evaluateEscapeSequences(str) {
    return str
        .replace(/\\n/g, '\n')
        .replace(/\\t/g, '\t')
        .replace(/\\r/g, '\r')
        .replace(/\\"/g, '"')
        .replace(/\\'/g, "'")
        .replace(/\\\\/g, '\\');
}

/**
 * Parse a multi-line string
 * @param {string[]} lines All lines in the file
 * @param {number} startIndex Start index of the multi-line string
 * @param {number} propertyIndent Indentation level of the property
 * @returns {[string, number]} Parsed string and the new line index
 */
function parseMultilineString(lines, startIndex, propertyIndent) {
    let result = '';
    let i = startIndex;

    while (i < lines.length) {
        const line = lines[i];
        const indent = countIndent(line);

        // If we encounter a line with same or less indent than the property,
        // we've reached the end of the multi-line string
        if (indent <= propertyIndent) {
            break;
        }

        // Add line content to the result
        if (result) {
            result += '\n';
        }
        result += line.trim();

        i++;
    }

    return [result, i];
}

function countIndent(line) {
    let count = 0;
    for (let i = 0; i < line.length; i++) {
        if (line[i] === ' ') {
            count++;
        } else {
            break;
        }
    }
    return count;
}