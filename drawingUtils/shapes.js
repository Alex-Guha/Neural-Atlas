import { globalState } from '../utils/state.js';

const content = d3.select("#content");

// Fairly self explanatory
export function drawSubcomponent(item) {
    for (let i = (item.count || 1) - 1; i >= 0; i--) {
        const x = item.x + item.xSpacing * i;
        const y = item.y + item.ySpacing * i;
        let shape = null;

        switch (item.shape) {
            case 'box':
                shape = drawBox(x, y, item);
                break;
            case 'triangle':
                shape = drawTriangle(x, y, item);
                break;
            case 'trapezoid':
                shape = drawTrapezoid(x, y, item);
                break;
            default:
                console.warn(`Unknown shape: ${item.shape}`);
                return;
        }

        shape.attr('data-info', item.info)
            .attr('data-details', item.details)
            .attr('data-references', item.references)
            .attr('opacity', (1 - i * 0.1) * (item.opacity ?? globalState.currentTheme.OPACITY))
            .attr('fill', globalState.currentTheme.SHAPE_FILL)
            .attr('stroke', globalState.currentTheme.SHAPE_STROKE);
    }
}

function drawBox(x, y, item) {
    return content.append('rect')
        .attr('x', x)
        .attr('y', y)
        .attr('width', item.width)
        .attr('height', item.height);
}

function drawTriangle(x, y, item) {
    const points = item.flipped
        ? [
            [x + item.width, y],
            [x + item.width, y + item.height],
            [x, y + item.height],
        ]
        : [
            [x, y],
            [x, y + item.height],
            [x + item.width, y + item.height],
        ];

    return content.append('polygon')
        .attr('points', points.map(p => p.join(',')).join(' '));
}

// item.height has to always be the longer side, otherwise item.flipped could be removed
function drawTrapezoid(x, y, item) {
    const shortSide = item.shortSide ?? item.height / 2;
    const longSide = item.height;
    const offset = longSide / 2 - shortSide / 2;

    const points = item.flipped
        ? [
            [x, y],
            [x, y + item.height],
            [x + item.width, y + offset + shortSide],
            [x + item.width, y + offset],
        ]
        : [
            [x, y + offset],
            [x, y + offset + shortSide],
            [x + item.width, y + item.height],
            [x + item.width, y],
        ];

    return content.append('polygon')
        .attr('points', points.map(p => p.join(',')).join(' '));
}