import * as DEFAULTS from '../utils/defaults.js';

/*
Rules:
- Each component must have a unique ID across both components and architectures.
- The output y-level should be the same as the input y-level.
- Component IDs cannot end with underscore + number (e.g., _1, _2, etc.) as these have special meaning in the parser.
- Naming Conventions:
    - Components that are simpler versions of other components and point to those more complex components should have the same name as the complex component, but with a suffix of _abstract.
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
                { text: 'Bottom', position: 'bottom', hideText: true, color: 1 },
                { text: 'Left', position: 'left', hideText: true, color: 2 },
                { text: 'Right', position: 'right', hideText: true, color: 3 },
                { text: 'Left Upper', position: 'left-top', hideText: true, color: 4 },
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

export const testSegmentedArrows = {
    content: {
        centerBox: {
            x: 700, y: 150, // implicit + default 50, 100
            width: DEFAULTS.SHAPE.width * 2,
            shape: 'box',
            text: {
                latexText: 'box_{center}',
                position: 'center',
            },
        },
        leftBox: {
            position: 'left',
            shape: 'box',
            previous: 'centerBox',
            count: 3, ySpacing: DEFAULTS.SHAPE.width / 8,
            arrow: {}
        },
        aboveBox: {
            position: 'above',
            width: DEFAULTS.SHAPE.width * 2, height: DEFAULTS.SHAPE.height / 2,
            shape: 'box',
            previous: 'centerBox',
            count: 3, xSpacing: -DEFAULTS.SHAPE.width / 4, ySpacing: DEFAULTS.SHAPE.width / 8,
            arrow: [
                {},
                {
                    segments: [
                        { direction: 'up' },
                        { direction: 'right' },
                    ],
                    previous: 'leftBox',
                },
                {
                    segments: [
                        { direction: 'left', extraLength: DEFAULTS.SHAPE.width / 4 },
                        { direction: 'up', extraLength: DEFAULTS.SHAPE.separation * 2 + DEFAULTS.SHAPE.width / 4 },
                        { direction: 'right' },
                        { direction: 'down' },
                    ],
                    previous: 'leftBox',
                },
                {
                    segments: [
                        { direction: 'right', extraLength: DEFAULTS.SHAPE.width / 4, yOffset: -DEFAULTS.SHAPE.width / 4 },
                        { direction: 'up' },
                        { direction: 'right' },
                        { direction: 'up', extraLength: DEFAULTS.SHAPE.width / 4, xOffset: -DEFAULTS.SHAPE.width / 4 },
                    ],
                    previous: 'leftBox',
                }
            ]
        },
        rightBox: {
            shape: 'box',
            previous: 'centerBox',
            count: 3, xSpacing: -DEFAULTS.SHAPE.width / 4,
            arrow: [
                {},
                {
                    segments: [
                        { direction: 'right' },
                        { direction: 'down' },
                    ],
                    previous: 'aboveBox',
                },
                {
                    segments: [
                        { direction: 'down', extraLength: DEFAULTS.SHAPE.width / 4, xOffset: DEFAULTS.SHAPE.width / 4 },
                        { direction: 'right' },
                        { direction: 'down' },
                        { direction: 'right', extraLength: DEFAULTS.SHAPE.width / 4, yOffset: -DEFAULTS.SHAPE.width / 4 },
                    ],
                    previous: 'aboveBox',
                },
                {
                    segments: [
                        { direction: 'up', extraLength: DEFAULTS.SHAPE.width / 4, xOffset: DEFAULTS.SHAPE.width / 4 },
                        { direction: 'right', extraLength: DEFAULTS.SHAPE.separation * 2 },
                        { direction: 'down' },
                        { direction: 'left', yOffset: -DEFAULTS.SHAPE.width / 4 },
                    ],
                    previous: 'aboveBox',
                }
            ]
        },
        belowBox: {
            position: 'below',
            width: DEFAULTS.SHAPE.width * 2, height: DEFAULTS.SHAPE.height / 2,
            shape: 'box',
            previous: 'centerBox',
            count: 3,
            arrow: [
                {},
                {
                    segments: [
                        { direction: 'down' },
                        { direction: 'left' },
                    ],
                    previous: 'rightBox',
                },
                {
                    segments: [
                        { direction: 'right', extraLength: DEFAULTS.SHAPE.width / 4 },
                        { direction: 'down', extraLength: DEFAULTS.SHAPE.separation * 2 + DEFAULTS.SHAPE.width / 4 },
                        { direction: 'left' },
                        { direction: 'up' },
                    ],
                    previous: 'rightBox',
                },
                {
                    segments: [
                        { direction: 'left', extraLength: DEFAULTS.SHAPE.width / 4, yOffset: DEFAULTS.SHAPE.width / 4 },
                        { direction: 'down' },
                        { direction: 'left' },
                        { direction: 'down', extraLength: DEFAULTS.SHAPE.width / 4, xOffset: DEFAULTS.SHAPE.width / 4 },
                    ],
                    previous: 'rightBox',
                }
            ]
        },

        centerBox2: {
            x: 750, y: 800, // implicit + default 50, 100
            width: DEFAULTS.SHAPE.width * 2,
            shape: 'box',
            text: {
                latexText: 'box_{center}',
                position: 'center',
            },
        },
        belowBox2: {
            position: 'below',
            width: DEFAULTS.SHAPE.width * 2, height: DEFAULTS.SHAPE.height / 2,
            shape: 'box',
            previous: 'centerBox2',
            count: 3,
            arrow: {}
        },
        leftBox2: {
            position: 'left',
            shape: 'box',
            previous: 'centerBox2',
            count: 3, ySpacing: DEFAULTS.SHAPE.width / 8,
            arrow: [
                {},
                {
                    segments: [
                        { direction: 'left' },
                        { direction: 'up' },
                    ],
                    previous: 'belowBox2',
                },
                {
                    segments: [
                        { direction: 'up', extraLength: DEFAULTS.SHAPE.width / 4, xOffset: -DEFAULTS.SHAPE.width / 4 },
                        { direction: 'left' },
                        { direction: 'up' },
                        { direction: 'left', extraLength: DEFAULTS.SHAPE.width / 4, yOffset: DEFAULTS.SHAPE.width / 4 },
                    ],
                    previous: 'belowBox2',
                },
                {
                    segments: [
                        { direction: 'down', extraLength: DEFAULTS.SHAPE.width / 4 },
                        { direction: 'left', extraLength: DEFAULTS.SHAPE.separation * 2 + DEFAULTS.SHAPE.width / 4 },
                        { direction: 'up' },
                        { direction: 'right' },
                    ],
                    previous: 'belowBox2',
                }
            ]
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

export const tokenization_abstract = {
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

export const embedding_abstract = {
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

export const unembedding_abstract = {
    content: {
        box: {
            shape: 'box',
            width: DEFAULTS.SHAPE.width * 2,
            info: "TODO",
            text: { text: 'unembedding', position: 'center' },
            details: 'unembedding',
            arrow: {
                text: { text: 'Final Norm' },
                info: 'TODO', details: 'rms'
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
                text: { text: 'Sampling' },
                info: 'TODO',
                details: 'sampling',
            }
        }
    }
}

export const decoder_abstract = {
    details: 'decoder',
    info: "TODO\n\nThere are {{numDecoderBlocks|N}} decoder blocks in this architecture.", // XXX property example {{property|default}}
    content: {
        decoder_box: {
            shape: 'box',
            width: DEFAULTS.SHAPE.width * 3,
            text: { text: 'Decoder' },
            arrow: {
                text: { text: 'Latents' },
                info: 'TODO',
            },
        },
        attn_box: {
            shape: 'box', previous: 'decoder_box',
            opacity: 1,
            width: DEFAULTS.SHAPE.width * 1.5,
            height: DEFAULTS.SHAPE.height * 0.75,
            x: DEFAULTS.SHAPE.width / 4,
            text: { text: 'Self-Attention', position: 'center' },
        },
        mlp_box: {
            shape: 'box', previous: 'attn_box',
            opacity: 1, width: DEFAULTS.SHAPE.width * 0.75,
            height: DEFAULTS.SHAPE.height * 0.75,
            separation: DEFAULTS.SHAPE.width / 4,
            text: { text: 'MLP', position: 'center' },
        },

        intermediate_box: {
            shape: 'box',
            width: DEFAULTS.SHAPE.width * 0.5,
            height: DEFAULTS.SHAPE.width * 0.5,
            previous: 'decoder_box',
            text: { latexText: '...', position: 'center' },
            arrow: {
                text: { text: 'Latents' },
                info: 'TODO',
            },
        },

        decoder_box_2: {
            shape: 'box', previous: 'intermediate_box',
            width: DEFAULTS.SHAPE.width * 3,
            text: { text: 'Decoder' },
            arrow: {
                text: { text: 'Latents' },
                info: 'TODO',
            },
        },
        attn_box_2: {
            shape: 'box', previous: 'decoder_box_2',
            opacity: 1,
            width: DEFAULTS.SHAPE.width * 1.5,
            height: DEFAULTS.SHAPE.height * 0.75,
            x: DEFAULTS.SHAPE.width / 4,
            text: { text: 'Self-Attention', position: 'center' },
        },
        mlp_box_2: {
            shape: 'box', previous: 'attn_box_2',
            opacity: 1, width: DEFAULTS.SHAPE.width * 0.75,
            height: DEFAULTS.SHAPE.height * 0.75,
            separation: DEFAULTS.SHAPE.width / 4,
            text: { text: 'MLP', position: 'center' },
        },
        hidden_box: {
            shape: 'box', width: 0,
            previous: 'mlp_box_2',
            separation: DEFAULTS.SHAPE.width / 4,

            // A bit of a hack to create the bracket shape using arrow segments.
            arrow: {
                previous: 'decoder_box',
                segments: [
                    {
                        direction: 'up',
                        extraLength: DEFAULTS.SHAPE.height / 8,
                        xOffset: -DEFAULTS.SHAPE.width * 1.5,
                        yOffset: -DEFAULTS.SHAPE.height / 4
                    },
                    {
                        direction: 'right',
                        text: { text: '{{numDecoderBlocks|N}} blocks total' } // XXX property example {{property|default}}
                    },
                    {
                        direction: 'down',
                        yOffset: -DEFAULTS.SHAPE.height / 4,
                        noHead: true,
                    },
                ],
            }
        },
    }
}

export const rms_abstract = {
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

export const swish_abstract = {
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

export const tokenization = {
    content: {}
}

export const embedding = {
    content: {}
}

export const unembedding = {
    content: {}
}

export const sampling = {
    content: {}
}

export const rms = {
    content: {}
}

export const swish = {
    content: {}
}

// TODO Add residuals
export const decoder = {
    content: {
        hidden_box: {
            shape: 'box', width: 0
        },
        residual_split: {
            shape: 'box', previous: 'hidden_box',
            width: DEFAULTS.SHAPE.width / 2,
            height: DEFAULTS.SHAPE.height / 4,
            separation: DEFAULTS.SHAPE.separation,
            arrow: {
                text: { text: 'latents' },
                info: 'TODO'
            }
        },
        norm_1: { component: 'rms_abstract', class: 'preAttnNorm' },
        attn: { component: 'mha', class: 'selfAttention' },
        norm_2: { component: 'rms_abstract', class: 'postAttnNorm' },
        mlp: { component: 'swish_abstract', class: 'feedforward' },
    }
}