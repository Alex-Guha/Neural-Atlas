/*
Abstract structure template:
```
architectureName:
    componentName
    componentName
    componentName:
        className: componentName
            className: componentName
        className: componentName
    componentName:
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
        className: ['componentName', { className: ['componentName', null] }],
        className: ['componentName', null]
    },
    componentName: {
        className: ['componentName', null],
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
        attention: ['mha', { normalization: ['layernorm', null] }],
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

// TODO Add properties like modelDimensions, number of layers, etc.
export const llama2_7B = {
    references: [
        {
            title: "Llama 2 Transformers Code",
            authors: [
                "HuggingFace",
                "EleutherAI",
            ],
            link: "https://github.com/huggingface/transformers/blob/v4.46.0/src/transformers/models/llama/modeling_llama.py",
            info: "todo",
            refType: "Github"
        },
    ],

    // The keys here point to components (in components.js). The values optionally override the default component settings.
    input: {},
    tokenization_abstract: {},
    embedding_abstract: {},
    /* llama 2's decoder is the default.
    The keys override elements within the component.
    The first list item is the component to swap in, the second is overrides for that swap in component.
    decoder: {
        preAttnNorm: ['rms', null],
        selfAttention: ['mha', { positional_encoding: ['rotary', null] }],
        postAttnNorm: ['rms', null],
        feedforward: ['swish', {}],
    }*/
    decoder_abstract: {},
    rms_abstract: {}, // final norm
    unembedding_abstract: {},
    output: {},
}