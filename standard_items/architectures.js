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

// TODO verify this - https://github.com/huggingface/transformers/blob/v4.46.0/src/transformers/models/llama/modeling_llama.py
export const llama2_7B = {
    references: [
        {
            title: "Llama 2 Transformers Code",
            authors: [
                "todo",
                "todo",
                "todo",
                "todo",
            ],
            link: "https://github.com/huggingface/transformers/blob/v4.46.0/src/transformers/models/llama/modeling_llama.py",
            info: "todo",
            refType: "Github"
        },
    ],
    input: {},
    tokenization: {},
    embeddings: {},
    decoder: {},
    /* llama 2's decoder is the default
    decoder: {
        normalization: ['layernorm', null],
        attention: ['mha', { positional_encoding: 'rotary' }],
        normalization: ['layernorm', null],
        feedforward: ['swish', {}],
    }*/
    postAttentionNorm: {},
    unembedding: {},
    sampling: {},
}