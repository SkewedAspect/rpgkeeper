// ---------------------------------------------------------------------------------------------------------------------

import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';
import stylistic from '@stylistic/eslint-plugin';
import pluginVue from 'eslint-plugin-vue';

// ---------------------------------------------------------------------------------------------------------------------

export default [
    { files: [ '**/*.{js,mjs,cjs,ts}' ] },
    { ignores: [ 'src/server/systems/unconverted/**/*' ] },
    {
        plugins: {
            '@stylistic': stylistic,
        },
    },
    pluginJs.configs.recommended,
    ...tseslint.configs.strict,
    ...tseslint.configs.stylistic,
    {
        rules: {
            'camelcase': 'error',
            'curly': 'error',
            'no-await-in-loop': 'error',
            'no-eval': 'error',
            'no-implicit-globals': 'error',
            'no-lone-blocks': 'error',
            'no-self-compare': 'error',
            'no-sequences': 'error',
            'no-throw-literal': 'error',
            'prefer-arrow-callback': [ 'error', { allowNamedFunctions: true } ],
            'prefer-promise-reject-errors': 'error',
            'no-label-var': 'error',
            'no-undefined': 'off',
            'no-use-before-define': 'error',
            'no-array-constructor': 'error',
            'no-object-constructor': 'error',
            'no-continue': 'error',
            'no-unneeded-ternary': 'error',
            'complexity': [ 'error', 70 ],
            'require-atomic-updates': 'off',
            'no-extra-bind': 'error',
            'no-useless-call': 'error',
            'no-useless-return': 'error',
            'require-await': 'off',
            'no-new-native-nonconstructor': 'error',

            // Style
            'consistent-this': [ 'error', 'self' ],
            'func-style': [ 'error', 'declaration', { allowArrowFunctions: true } ],
            'id-length': [ 'error', { min: 2, exceptions: [ '$', '_', 'i', 'x', 'y', 'z' ] } ],
            'no-duplicate-imports': 'error',
            'no-lonely-if': 'error',
            'no-multi-assign': 'error',
            'no-useless-computed-key': 'error',
            'no-useless-rename': [
                'error',
                {
                    ignoreDestructuring: false,
                    ignoreImport: false,
                    ignoreExport: false,
                },
            ],
            'sort-imports': [ 'error',
                {
                    ignoreCase: false,
                    ignoreDeclarationSort: true,
                    ignoreMemberSort: false,
                    memberSyntaxSortOrder: [ 'none', 'all', 'multiple', 'single' ],
                    allowSeparatedGroups: true,
                } ],
            'object-shorthand': [ 'error', 'always' ],
            'one-var': [ 'error', 'never' ],
            'prefer-object-spread': 'error',
            'prefer-template': 'error',
            'yoda': [ 'error', 'never', { exceptRange: true } ],
            '@stylistic/no-floating-decimal': 'error',
            '@stylistic/no-mixed-operators': 'error',
            '@stylistic/no-multi-spaces': 'error',
            '@stylistic/array-bracket-newline': [ 'error', 'consistent' ],
            '@stylistic/array-bracket-spacing': [ 'error', 'always' ],
            '@stylistic/array-element-newline': [ 'error', 'consistent' ],
            '@stylistic/arrow-parens': [ 'error', 'always' ],
            '@stylistic/arrow-spacing': 'error',
            '@stylistic/block-spacing': 'error',
            '@stylistic/brace-style': [ 'error', 'allman', { allowSingleLine: true } ],
            '@stylistic/comma-dangle': [ 'error', {
                arrays: 'always-multiline',
                objects: 'always-multiline',
                imports: 'always-multiline',
                exports: 'always-multiline',
                enums: 'always-multiline',
                generics: 'always-multiline',
                tuples: 'always-multiline',
                functions: 'never',
            } ],
            '@stylistic/comma-spacing': [ 'error', { before: false, after: true } ],
            '@stylistic/comma-style': [ 'error', 'last' ],
            '@stylistic/computed-property-spacing': [ 'error', 'never' ],
            '@stylistic/eol-last': [ 'error', 'always' ],
            '@stylistic/func-call-spacing': [ 'error', 'never' ],
            '@stylistic/function-paren-newline': [ 'error', 'multiline-arguments' ],
            '@stylistic/generator-star-spacing': [ 'error', { before: true, after: false } ],
            '@stylistic/indent': [
                'error',
                4,
                {
                    SwitchCase: 1,
                    VariableDeclarator: 1,
                    outerIIFEBody: 1,
                    MemberExpression: 1,
                    FunctionDeclaration: {
                        parameters: 1,
                        body: 1,
                    },
                    FunctionExpression: {
                        parameters: 1,
                        body: 1,
                    },
                    CallExpression: {
                        arguments: 1,
                    },
                    ArrayExpression: 1,
                    ObjectExpression: 1,
                    ImportDeclaration: 1,
                    flatTernaryExpressions: false,
                },
            ],
            // TODO: This rule conficts with the type-annotation-spacing rule. We need to disable this and use the
            // deprecated key-spacing rule instead.
            // @see: https://github.com/eslint-stylistic/eslint-stylistic/issues/476
            // '@stylistic/key-spacing': [ 'error', { beforeColon: false, afterColon: true } ],
            'key-spacing': [ 'error', { beforeColon: false, afterColon: true } ],
            '@stylistic/keyword-spacing': [
                'error',
                {
                    overrides: {
                        if: { after: false },
                        for: { after: false },
                        while: { after: false },
                    },
                },
            ],
            '@stylistic/lines-between-class-members': [
                'error',
                'always',
                {
                    exceptAfterSingleLine: true,
                    exceptAfterOverload: true,
                },
            ],
            '@stylistic/max-len': [ 'error', { code: 120 } ],
            '@stylistic/new-parens': 'error',
            '@stylistic/newline-per-chained-call': [ 'error', { ignoreChainWithDepth: 2 } ],
            '@stylistic/no-confusing-arrow': [ 'error', { allowParens: false } ],
            '@stylistic/no-multiple-empty-lines': [ 'error', { max: 1, maxBOF: 0, maxEOF: 1 } ],
            '@stylistic/no-whitespace-before-property': 'error',
            '@stylistic/object-curly-spacing': [ 'error', 'always' ],
            '@stylistic/object-property-newline': [ 'error', { allowAllPropertiesOnSameLine: true } ],
            '@stylistic/operator-linebreak': [ 'error', 'before' ],
            '@stylistic/padded-blocks': [ 'error', 'never' ],
            '@stylistic/quote-props': [ 'error', 'consistent-as-needed' ],
            '@stylistic/quotes': [ 'error', 'single', { avoidEscape: true, allowTemplateLiterals: true } ],
            '@stylistic/semi': [ 'error', 'always' ],
            '@stylistic/semi-spacing': [ 'error', { before: false, after: true } ],
            '@stylistic/space-before-blocks': 'error',
            '@stylistic/space-before-function-paren': 'off',
            '@stylistic/space-in-parens': [ 'error', 'never' ],
            '@stylistic/space-infix-ops': 'error',
            '@stylistic/space-unary-ops': 'error',
            '@stylistic/spaced-comment': [
                'error',
                'always',
                {
                    line: {
                        markers: [ '/' ],
                        exceptions: [ '-', '+' ],
                    },
                    block: {
                        markers: [ '!' ],
                        exceptions: [ '*' ],
                        balanced: true,
                    },
                },
            ],
            '@stylistic/switch-colon-spacing': 'error',
            '@stylistic/template-curly-spacing': [ 'error', 'always' ],
            '@stylistic/template-tag-spacing': 'error',
            '@stylistic/yield-star-spacing': [ 'error', 'before' ],

            // Overrides for Typescript rules to supersede the default rules
            'no-shadow': 'off',

            // TypeScript
            '@typescript-eslint/no-explicit-any': 'off',
            '@typescript-eslint/explicit-function-return-type': [ 'error', { allowExpressions: true } ],
            '@typescript-eslint/no-shadow': 'error',
            '@stylistic/type-annotation-spacing': [ 'error', { before: true, after: true } ],
            '@typescript-eslint/no-unused-vars': [
                'error',
                {
                    ignoreRestSiblings: true,
                    argsIgnorePattern: '^_',
                    caughtErrorsIgnorePattern: '^_',
                },
            ],
        },
    },

    // -----------------------------------------------------------------------------------------------------------------
    // Overrides
    // -----------------------------------------------------------------------------------------------------------------

    {
        // These files deal with databases, and we can't force columns to be camelCase, so we disable the rule here.
        files: [
            'src/server/resource-access/**/*.ts',
            'src/server/models/**/*.ts',
            'src/server/knex/seeds/**/*',
            'src/server/knex/migrations/**/*',
        ],
        rules: {
            camelcase: 'off',
        },
    },

    {
        // These are very long strings and wrapping them sucks.
        files: [
            'src/server/knex/seeds/**/*',
            'src/server/knex/migrations/**/*',
        ],
        rules: {
            '@stylistic/max-len': 'off',
        },
    },

    // -----------------------------------------------------------------------------------------------------------------
    // Vue
    // -----------------------------------------------------------------------------------------------------------------

    ...pluginVue.configs['flat/recommended'],
    {
        files: [ '*.vue', '**/*.vue' ],
        languageOptions: {
            parserOptions: {
                parser: '@typescript-eslint/parser',
            },
        },
        rules: {
            // Overrides for Vue rules to supersede the default rules
            '@stylistic/indent': 'off',
            '@typescript-eslint/no-unused-vars': 'off',

            // Bad Practices
            'no-console': [
                'error',
                { allow: [ 'debug', 'info', 'warn', 'error' ] },
            ],

            // Style
            'vue/component-tags-order': [ 'error', {
                order: [ 'template', 'style', 'script' ],
            } ],
            'vue/valid-v-on': [
                'warn',
                {
                    modifiers: [ 'slash', 'dash' ],
                },
            ],
            'vue/max-attributes-per-line': [
                'error', {
                    singleline: 20,
                    multiline: 1,
                },
            ],
            'vue/first-attribute-linebreak': [ 'error', {
                singleline: 'ignore',
                multiline: 'below',
            } ],
            'vue/html-indent': [
                'warn',
                4,
                {
                    attribute: 1,
                    baseIndent: 1,
                    closeBracket: 0,
                    alignAttributesVertically: true,
                },
            ],
            'vue/script-indent': [
                'warn',
                4,
                {
                    baseIndent: 1,
                    switchCase: 1,
                    ignores: [],
                },
            ],
            'vue/component-name-in-template-casing': [ 'error', 'PascalCase', { registeredComponentsOnly: false } ],

            // Disabled because it catches html comments in between component tags
            'vue/valid-attribute-name': 'off',
            'vue/valid-model-definition': 'off',
        },
    },
];

// ---------------------------------------------------------------------------------------------------------------------
