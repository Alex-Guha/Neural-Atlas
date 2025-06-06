import * as DEFAULTS from '../utils/defaults.js';

/*
Rules:
- Each component must have a unique ID.
- The output y-level should be the same as the input y-level.
*/

// TODO Make a components folder in standard_items, and divide components by class into their own files. For example, MHA, MLA, etc. would go into attention.js.

export const testText = {
    settings: [{ label: 'Hide Text', id: 'hide-text', property: 'hideText' }],
    references: [
        {
            title: "Test 0",
            authors: [
                "Test McTesty",
                "Tester McTestface",
                "Testy McTesterson",
            ],
            link: "https://google.com",
            info: "This is a test reference",
            refType: "Website"
        },
    ],
    content: {
        box: {
            width: DEFAULTS.SHAPE.height * 2, height: DEFAULTS.SHAPE.height * 2,
            info: "Sample box 1 info", shape: 'box',
            text: [
                { text: 'Box', position: 'center' },
                { text: 'Top', hideText: true },
                { text: 'Bottom', position: 'bottom', hideText: true },
                { text: 'Left', position: 'left', hideText: true },
                { text: 'Right', position: 'right', hideText: true },
                { text: 'Left Upper', position: 'left-top', hideText: true },
                { text: 'Right Upper', position: 'right-top', hideText: true },
                { text: 'Left Lower', position: 'left-bottom', hideText: true },
                { text: 'Right Lower', position: 'right-bottom', hideText: true },
                { text: 'Left Upper', position: 'top-left', hideText: true },
                { text: 'Right Upper', position: 'top-right', hideText: true },
                { text: 'Left Lower', position: 'bottom-left', hideText: true },
                { text: 'Right Lower', position: 'bottom-right', hideText: true },
            ],
        },
        placeholder_id: { component: 'testLatex', class: 'swappable' }
    }
}

export const testLatex = {
    settings: [{ label: 'Hide Text', id: 'hide-text', property: 'hideText' }],
    references: [
        {
            title: "Test 1",
            authors: ["Testerson Testers"],
            link: "https://github.com",
            info: "This is another test reference",
            refType: "Github"
        },
    ],
    content: {
        box: {
            position: 'below',
            width: DEFAULTS.SHAPE.height * 2, height: DEFAULTS.SHAPE.height * 2,
            info: "Sample box 2 info", shape: 'box',
            text: [
                { latexText: 'Latex Box', position: 'center' },
                { latexText: 'Top', hideText: true },
                { latexText: 'Bottom', position: 'bottom', hideText: true },
                { latexText: 'Left', position: 'left', hideText: true },
                { latexText: 'Right', position: 'right', hideText: true },
                { latexText: 'Left Upper', position: 'left-top', hideText: true },
                { latexText: 'Right Upper', position: 'right-top', hideText: true },
                { latexText: 'Left Lower', position: 'left-bottom', hideText: true },
                { latexText: 'Right Lower', position: 'right-bottom', hideText: true },
                { latexText: 'Left Upper', position: 'top-left', hideText: true },
                { latexText: 'Right Upper', position: 'top-right', hideText: true },
                { latexText: 'Left Lower', position: 'bottom-left', hideText: true },
                { latexText: 'Right Lower', position: 'bottom-right', hideText: true },
            ],
        },
    }
}

export const testEverything = {
    settings: [
        { label: 'Hide Arrows', id: 'hide-arrow', property: 'hideArrows', noRedraw: false },
        { label: 'Hide Trapezoids', id: 'hide-trapezoids', property: 'hideTrapezoids' },
    ],
    content: {
        everything: {
            y: -200, separation: 550, // In the testing architecture, the above box_2 is the previous, so this needs to be moved up a little and over a lot.
            // x and position are implicit. They are excluded for the sake of component stitching.
            width: DEFAULTS.SHAPE.width * 2, height: DEFAULTS.SHAPE.height,
            info: "Every Possible Setting except arrow, which require a previous.\n\nShape color and stroke are theme based and not overridable, at least for now. They could easily be, though.",
            shape: 'box',
            details: 'testSegmentedArrows',
            opacity: 0.8,
            count: 3, xSpacing: DEFAULTS.SHAPE.width / 4, ySpacing: -DEFAULTS.SHAPE.width / 8,
            text: {
                latexText: 'box_{everything}',
                position: 'center',
                xOffset: -DEFAULTS.SHAPE.width / 8,
                yOffset: -DEFAULTS.SHAPE.width / 16,
                info: "Info Override",
                color: "#00ffff",
                references: [
                    {
                        title: "Reference Override",
                    }
                ],
            },
            references: [
                {
                    title: "Test Reference",
                    authors: [
                        "John Doe"
                    ],
                    link: "https://arxiv.org/pdf/genericarxivlink",
                    info: "Some text that should show in the info box",
                    refType: "PDF"
                }
            ],
        },

        // Left of 'everything'
        everything_trapezoid_1: {
            position: 'left',
            // width and height pull from default
            // shortSide is inferred from height
            shape: 'trapezoid',
            previous: 'everything', hideTrapezoids: true,
            text: { text: 'Left', position: 'center', color: "#00ffff" },
            arrow: {
                // inferred direction: 'left' from position
                hideArrows: true,
                text: [{ text: 'Left Arrow' }],
                // More optional overrides:
                // xOffset, yOffset, noHead, reversed, extraLength
                // info, references, details
            },
        },

        // Right of 'everything'
        everything_trapezoid_2: {
            // implicit position = right
            // width and height pull from default
            // shortSide is inferred from height
            flipped: true,
            shape: 'trapezoid',
            previous: 'everything', hideTrapezoids: true,
            text: { text: 'Right', position: 'center', color: "#00ffff" },
            arrow: {
                // inferred direction: 'right' as default
                hideArrows: true,
                text: [{ text: 'Right Arrow', position: 'bottom' }],
            },
        },

        // Above 'everything'
        everything_triangle_1: {
            position: 'above',
            width: DEFAULTS.SHAPE.width * 2,
            shape: 'triangle',
            previous: 'everything',
            count: 3,
            text: {
                text: 'Above',
                position: 'center',
                color: "#00ffff",
                xOffset: -DEFAULTS.SHAPE.width / 4,
                yOffset: DEFAULTS.SHAPE.height / 16,
            },
            arrow: {
                // inferred direction: 'up' from position
                hideArrows: true,
                text: [{ text: 'Up Arrow', position: 'left' }],
            },
        },

        // Below 'everything'
        everything_triangle_2: {
            position: 'below',
            width: DEFAULTS.SHAPE.width * 2,
            shape: 'triangle',
            previous: 'everything',
            count: 3, xSpacing: -DEFAULTS.SHAPE.width / 4, ySpacing: -DEFAULTS.SHAPE.width / 8,
            flipped: true,
            text: {
                text: 'Below',
                position: 'center',
                color: "#00ffff",
                xOffset: DEFAULTS.SHAPE.width / 4,
                yOffset: DEFAULTS.SHAPE.height / 16,
            },
            arrow: {
                // inferred direction: 'down' from position
                hideArrows: true,
                text: [{ text: 'Down Arrow', position: 'right' }],
                extraLength: DEFAULTS.SHAPE.height / 2 - DEFAULTS.SHAPE.width / 2,
            },
        },
    }
}

export const testSwappable = {
    content: {
        swap: {
            width: DEFAULTS.SHAPE.width * 2, height: DEFAULTS.SHAPE.height,
            info: "Test nested component swapping.",
            shape: 'box',
            opacity: 0.8,
            text: {
                latexText: 'box_{swap}',
                position: 'center',
            },
        },
    }
}

// TODO Everything below this.

export const input = {
    content: {
        box: {
            shape: 'box',
            info: "TODO",
            text: { text: 'input' },
        }
    }
}

// TODO Add a bit more content to this, to make the default view more interesting.
export const tokenization = {
    content: {
        box: {
            shape: 'box',
            info: "TODO",
            text: { text: 'tokenization' },
            details: 'tokenization',
            arrow: {
                text: { text: 'Input Text' },
                info: 'Sample user input'
            }
        }
    }
}

// TODO Add a bit more content to this, to make the default view more interesting.
export const embedding = {
    content: {
        box: {
            shape: 'box',
            width: DEFAULTS.SHAPE.width * 2,
            info: "TODO",
            text: { text: 'embedding', position: 'center' },
            details: 'embedding',
            arrow: {
                text: { text: 'Tokenized Text' },
                info: 'Ideally, same info as tokenization box'
            }
        }
    }
}

// TODO Add a bit more content to this, to make the default view more interesting.
export const unembedding = {
    content: {
        box: {
            shape: 'box',
            width: DEFAULTS.SHAPE.width * 2,
            info: "TODO",
            text: { text: 'unembedding', position: 'center' },
            details: 'unembedding',
            arrow: {
                text: { text: 'TODO' },
                info: 'TODO'
            }
        }
    }
}

export const output = {
    content: {
        box: {
            shape: 'box',
            info: "TODO",
            text: { text: 'output' },
            arrow: {
                text: { text: 'sampling' },
                info: 'TODO',
                details: 'sampling',
            }
        }
    }
}

// TODO Visualize that there are multiple subsequent decoder layers, and that they are all the same.
export const decoder = {
    content: {
        box: {
            shape: 'box',
            info: "TODO",
            text: { text: 'decoder' },
            details: 'decoder',
            arrow: {
                text: { text: 'latents' },
                info: 'TODO'
            }
        }
    }
}

export const rms = {
    content: {
        box: {
            shape: 'box',
            info: "TODO",
            text: { text: 'rms' },
            details: 'rms',
            arrow: {
                text: { text: 'TODO' },
                info: 'TODO'
            }
        }
    }
}

export const mha = {
    content: {
        box: {
            shape: 'box',
            info: "TODO",
            text: { text: 'mha' },
            arrow: {
                text: { text: 'TODO' },
                info: 'TODO'
            }
        }
    }
}

export const swish = {
    content: {
        box: {
            shape: 'box',
            info: "TODO",
            text: { text: 'swish' },
            arrow: {
                text: { text: 'TODO' },
                info: 'TODO'
            }
        }
    }
}