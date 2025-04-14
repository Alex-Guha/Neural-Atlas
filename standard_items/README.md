# Standard Items

## Architectures
An abstract structure definition, designed for ease of use and prototyping.

Architectures construct a view by stitching together existing components. When a component has swappable elements, the user can specify to override them at this level.

These are what users interact with and define new diagrams in.

### Syntax:
#### Current
```
export const architectureName = {
    componentName: null,
    componentName: null,
    componentName: {
        className: ['componentName', { className: 'componentName' }],
        className: ['componentName', null]
    },
    componentName: null,
}
```
#### Future
```
architectureName:
    componentName
    componentName
    componentName:
        className: componentName
            className: componentName
        className: componentName
    componentName
```

### Example:
#### Current
```
export const llama2 = {
    tokenizer: {},
    embedding: {},
    decoder: {
        attention: ['mha', { normalization: 'layernorm' }],
        feedforward: ['gated', {}]
    },
    unembedding: {},
}
```

#### Future
```
llama2:
    tokenizer
    embedding
    decoder:
        attention: mha
            normalization: layernorm
        feedforward: gated
    unembedding
```


## Components
A concrete structure definition, allowing for complex diagram creation.

Components can be anything from a single subcomponent (probably with a detail reference) to complex diagrams such as the attention mechanism.

These are not intended to be created directly by the average user, instead used as building blocks to construct new diagrams.

### Notes:
- Components can be constructed from both subcomponents and other components.
- The first element obviously can't have a previous, but also shouldn't have position or x/y (though they can if needed).
- The last element should be positioned on the same y level as the first element, so that component chaining has no issues.
- Any specified references and/or settings will be combined into the parent's during parsing.
- Component nesting looks like: "placeholder_id: { component: 'ComponentName' }" in contents
    - Generally, the next item shouldn't have a previous set, but it can if nothing depends on the component.
    - placehold_id needs to be unique, but isn't used at all

### Syntax:
```
```

### Example:
```
```


## Details
Although identical to components in syntax, these differ by specifying a view directly instead of being integrated into other diagrams.

As such, details are used to change the view (via double-clicking an item), usually for a complex matrix-level explanation, though they can also be used for a more detailed view of a component.

The decision to separate components and details is simply for sanity's sake. Keeping track of which components should be used as views and which are strictly for integrating into other diagrams can quickly become a headache.

### Notes:
- Pointed to with "details: detail_id" in a component item

### Syntax:
```
```

### Example:
```
```