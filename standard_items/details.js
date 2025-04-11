import * as DEFAULTS from '../utils/defaults.js';
/*
Details:
    - Changes what's rendered
    - Referenced by "details: detail_id" in an item
    - Generally complex diagrams
    - Can have settings and references
    - Can be used either for a more detailed view of a component, or for lowest level (matrix) explanation
        - i.e. we could have a Decoder-box component (for more abstract diagrams) that detail reference for Decoder,
            which in turn here in details just contains a pointer to the actual Decoder component (like { component: 'Decoder' })
        - So, in essence, Decoder can be incorporated either as abstract->detail or directly as a component of an architecture
        - Keep in mind that the goal is to have such things be modular, so that even things within the component can be swapped out at the architecture level
*/

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