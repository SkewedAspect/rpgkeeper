module.exports = {
    extends: [
        'plugin:vue/vue3-recommended'
    ],
    parser: 'vue-eslint-parser',
    parserOptions: {
        parser: '@typescript-eslint/parser'
    },
    rules: {
        // Bad Practices
        'no-console': [
            'error',
            { allow: [ 'debug', 'info', 'warn', 'error' ] }
        ],

        // Style
        'vue/component-tags-order': [ 'error', {
            order: [ 'template', 'style', 'script' ]
        } ],
        'vue/valid-v-on': [
            'warn',
            {
                modifiers: [ 'slash', 'dash' ]
            }
        ],
        'vue/max-attributes-per-line': [
            'error', {
                singleline: 20,
                multiline: 1
            }
        ],
        'vue/first-attribute-linebreak': [ 'error', {
            singleline: 'ignore',
            multiline: 'below'
        } ],
        'vue/html-self-closing': [
            'error',
            {
                // Due to a parcel bug, we must never have self-closing tags.
                // See: https://github.com/parcel-bundler/parcel/issues/1103
                html: {
                    void: 'always',
                    normal: 'never',
                    component: 'never'
                },
                svg: 'always',
                math: 'always'
            }
        ],
        'vue/html-indent': [
            'warn',
            4,
            {
                attribute: 1,
                baseIndent: 1,
                closeBracket: 0,
                alignAttributesVertically: true
            }
        ],
        'vue/script-indent': [
            'warn',
            4,
            {
                baseIndent: 1,
                switchCase: 1,
                ignores: []
            }
        ],

        // Disabled because it catches html comments in between component tags
        'vue/valid-attribute-name': 'off',
        'vue/valid-model-definition': 'off'

    },
    overrides: [
        {
            files: [ '*.vue' ],
            rules: {
                '@typescript-eslint/no-unused-vars': 'off',
                'indent': 'off'
            }
        }
    ]
};
