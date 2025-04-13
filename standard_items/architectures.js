/*
Architectures:
    - Essentially an abstraction of details.
    - Strictly constructed from existing components, with no subcomponents.
    - TODO Allow for non-sequential component combination in the future
        - i.e. if multiple components want to branch off one.
        - Would require the ability to specify a previous in the architecture

TODO Write a parser to convert a more abstract, yaml-like architecture definition into the intermediary structure that parser.js expects:
Eventually, parser.js should be able to parse this directly, but for now, convert into the intermediary structure.

Abstract structure template:
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

Equivalent intermediary structure template (what the parsing methods expect):
```
export const architectureName = {
    componentName: {} | null,
    componentName: null,
    componentName: {
        className: ['componentName', { className: 'componentName' }],
        className: ['componentName', null]
    },
    componentName: null,
}
```

Example:
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
*/

export const test = {
    testText: null,
    testEverything: null,
}

export const testswap = {
    testText: {
        swappable: ['testSwappable', null]
    },
    testEverything: null,
}