# TODO

## Before Release

### Create Architectures
#### Identify common components and make modules for them
- Any component with single in and out

#### Attention Mechanisms
- multihead MHA
- multiquery MQA
- Grouped Query GQA
- Multihead Latent MLA
- https://www.youtube.com/watch?v=0VLAoVGf_74&list=TLPQMjkwMzIwMjWusXFyz2lhrg&index=2

#### Separate out core functionality from equivalent optimization (like KV caching)

#### Incorporate visuals for what the attention mechanism does, ala 3b1b
- [correlogram](https://d3-graph-gallery.com/graph/correlogram_basic.html)
- [heatmap](https://d3-graph-gallery.com/heatmap.html)
- [multiple distributions](https://observablehq.com/@d3/psr-b1919-21)
- [3d sphere](https://observablehq.com/@d3/versor-dragging)
- [Ridge Plot](https://seaborn.pydata.org/examples/kde_ridgeplot.html)/[Joy plot](https://github.com/leotac/joypy)
- https://observablehq.com/@d3/gallery?utm_source=d3js-org&utm_medium=hero&utm_campaign=try-observable


### Separate components into separate files based on what class they are


### Core Features
#### Yaml-like Architecure definitions
- Write a parser for more abstract, yaml-like architecture definitions
- See TODO in architectures.js

#### Importing
- Allow for importing the following, so that users may define and share custom versions of each, especially for developing diagrams before adding them to the central repo
  - The architecture yaml-like
  - Individual components
  - Individual details
- Exporting should be handled in the editing section below
- No point in exporting/importing the full rendered svg, info/references/details don't translate without the accompanying renderer
- Save imported stuff to local storage and recombine with predefined stuff on load

#### Editing and Exporting
- Togglable nav button to enter editing mode
  - Clicking this changes the info box to have 3 options: "Edit current architecture", "Create new architecture", "Create new component"
- Architecture editing mode (making architectures out of components)
  - Show the flat file yaml-like definition of the architecture in the info box, potentially like a text editor
  - Have some way for the user to select from the component list instead of having them type out the component they want to add
  - There should be an export button, which downloads the custom/modified architecture
- Component editing mode (making components out of boxes, text, basic shapes, and other components)
  - The info box defaults to something like: "Select an item to edit or add new items after"
  - Selecting an item changes the info box to have value entry fields and sliders and toggles and w/e for each of the properties a component can have, prepopulated with the default values
    - Think about how arrows, text, info, and references should be displayed as editable fields
    - There should also be a dropdown for adding an item after the selected element
    - Don't overcook too much for a first version. QoL like being able to change the previous by selecting an item in the diagram can come later.
  - There should be an export button, which downloads the custom component
- No need to add a detail editing mode, users should not need to add new ones for now, and can write them out as js files and import them if they really want to.
- Potentially add a way to export both the architecture and the list of components together, in case a user made a custom architecture containing custom components
- Consider what the references box could be used for. Maybe that becomes the text entry field for the component editing mode, where a user can select "Edit info" and type in this.
- For all of these, there should be auto saving to local storage


### Citation
#### Citable resources:
- 3b1b: https://www.youtube.com/watch?v=eMlx5fFNoYc&list=PLZHQObOWTQDNU6R1_67000Dx_ZCJB-3pi&index=7
- https://jalammar.github.io/illustrated-transformer/
- https://www.youtube.com/watch?v=kCc8FmEb1nY
- https://bbycroft.net/llm

#### Add attribution to README
```
This project was inspired by [LLM Visualizer](https://github.com/learn-good/llm_viz/tree/main), created by [Arno Khachatourian].  
The code has been rewritten and significantly expanded.
```

#### Think about citation capability
- i.e. If original research is written into the components, they should be citable
- The whole website should also be citable


### QoL
#### Make double-clickable items more noticeable, and add a notice at the top or bottom of the info box to tell the user the item is clickable
#### Improve the UI for buildViewTree (events.js), offload css to styles.css
#### Add a link to the github repo


### Write a README
### Write a proper roadmap
### Write CONTRIBUTING

---

## Low Priority

### Look into the limits of github.io sites, might want to host elsewhere

### Comparison
Add the ability to compare two architectures visually (highlighting the differences between generations)

### Drag and drop editing
- make it possible to click and drag an element, and have all subsequent elements in the graph move with it
- if also holding shift, only move the selected element


### Additional QoL
#### Zoom
- Currently, zoom.js gives the svg content an offset of (100, 150).
- Instead, use this to center the content vertically.
- So, translate by (100, view_height / 2 - content_height / 2)
- This may not be possible for the first rendering, since the zoom is reset in drawContent before the svg is rendered, so content_height doesn't exist yet.

#### Navigation
- Save the architecture or details name (on changing views) in local storage and load it (via loadSettings) on page load
- Make the settings and views buttons mouseover behavior persist when the button has been clicked (i.e. when the settings or views menu is open), and reset when the resetSidebar event is called

#### Arrows
- rewrite to allow for multiple previous elements and thus multiple arrows
- Enforce a min arrow size based on text bbox, and propogate to item arrangement
  - Draw text, get bbox, delete text, adjust arrow end position, redraw text
  - Return out the difference in x (arrow.width - item.x) and y to adjust the item position (drawArrow would need to be called before drawing the shape)
- Add euclidean arrow option?
- Maybe: For the residual arrows, potentially record the max y in main and go from previousItem.y to that plus a little bit

#### Item Rendering
- Make a toggle to show the graph structure by drawing lines between components instead of rendering them, and tacking on the component name
- Maybe: The current method of storing positions can't handle referencing an item that hasn't been drawn yet, which prevents arrow cycles. This might be fine though, since it also prevents circular dependencies

#### Test
- Auto split text into multiple lines based on textObject width, if it exists

### Efficiency and Optimization
#### updateReferences
Stop redrawing references when they are the same as the previous ones, without storing the previous references in a global variable

#### renderElements
Look into D3's enter-update-exit pattern to optimize rendering.


### Integrate WebGPU to run through real examples on smaller models