const content = d3.select("#content");
const svg = d3.select("#svg");

export function resetZoom() {
    const zoom = d3.zoom()
        .scaleExtent([0.25, 2])
        .on('zoom', (event) => (content.attr('transform', event.transform)));

    svg.call(zoom).on("dblclick.zoom", null);

    svg.transition().duration(500).call(
        zoom.transform,
        d3.zoomIdentity.translate(100, 150).scale(0.70)
    );
}