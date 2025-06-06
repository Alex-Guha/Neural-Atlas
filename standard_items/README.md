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
- Components can also be detailed views of components, or more often for complex matrix-level explanations.
    - This happens when a component item contains the property "details: component_id"

### Syntax:
```
```

### Example:
```
```