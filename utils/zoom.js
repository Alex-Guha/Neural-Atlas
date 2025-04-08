const contentLayer = d3.select("#content-layer");
const svg = d3.select("#svg");

export function setupZoom() {
    const zoom = d3.zoom()
        .scaleExtent([0.25, 2])
        .on('zoom', (event) => (contentLayer.attr('transform', event.transform)));

    svg.call(zoom).on("dblclick.zoom", null);

    return zoom;
}

export function resetZoom() {
    const zoom = setupZoom();
    svg.transition().duration(500).call(
        zoom.transform,
        d3.zoomIdentity.translate(10, 150).scale(0.60)
    );
}