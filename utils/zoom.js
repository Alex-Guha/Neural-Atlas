const content = d3.select("#content");
const svg = d3.select("#svg");

export function resetZoom() {
    const zoom = d3.zoom()
        .scaleExtent([0.25, 2])
        .on('zoom', (event) => (content.attr('transform', event.transform)));

    svg.call(zoom).on("dblclick.zoom", null);

    // Function to apply the centered zoom transform
    const applyCenteredZoom = (firstChild) => {
        const svgNode = svg.node();
        const svgRect = svgNode.getBoundingClientRect();
        
        // Calculate the center Y position based on first item and SVG height
        const scale = 0.70;
        const centerY = (svgRect.height / 2) - (firstChild.getAttribute('y') * scale) - (firstChild.getAttribute('height') / 2 * scale) - (svgRect.height / 16);

        svg.transition().duration(500).call(
            zoom.transform,
            d3.zoomIdentity.translate(100, centerY).scale(scale)
        );
    };

    // Check if content is already available, otherwise wait for it
    const firstChild = content.node()?.firstElementChild;
    if (firstChild) {
        // Content is available, apply zoom immediately
        applyCenteredZoom(firstChild);
    } else {
        // Wait for content to be rendered, then apply zoom
        const checkForContent = () => {
            const firstChild = content.node()?.firstElementChild;
            if (firstChild) {
                applyCenteredZoom(firstChild);
            } else {
                // Check again after a short delay
                setTimeout(checkForContent, 50);
            }
        };
        // Start checking after a small initial delay
        setTimeout(checkForContent, 50);
    }
}