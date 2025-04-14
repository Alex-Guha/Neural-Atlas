/*
TODO Write a parser to convert a more abstract, yaml-like architecture definition into the JSON that parser.js expects:
Eventually, parser.js should be able to parse this directly, but for now, first convert into the JSON.

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