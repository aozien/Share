/* eslint-disable no-magic-numbers */
module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
    jest: true,
  },
  extends: [
    'google',
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:jsx-a11y/recommended',
    'plugin:jsdoc/recommended',
    'plugin:cypress/recommended',
  ],
  overrides: [{
    files: ['*.js', '*.mjs', '*.jsx'],
  }],
  parser: '@babel/eslint-parser',
  parserOptions: {
    babelOptions: {
      plugins: [
        '@babel/syntax-import-assertions',
      ],
    },
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: [
    'cypress',
    'import',
    'react',
    'jsx-a11y',
    'jsdoc',
  ],
  rules: {
    'import/newline-after-import': ['error', {count: 2}],
    'max-len': ['error', 140],
    'no-irregular-whitespace': ['error'],
    'no-trailing-spaces': ['error'],
    'prefer-rest-params': 'off',
    'quote-props': ['error', 'consistent-as-needed'],
    'react/prop-types': 'off',
    'semi': ['error', 'never'],
    'arrow-spacing': ['error', {before: true, after: true}],
    'space-infix-ops': ['error'],
    'react/jsx-equals-spacing': [2, 'never'],
    'curly': ['error', 'all'],
    'default-case': 'error',
    'default-param-last': ['error'],
    'eqeqeq': ['error', 'always'],
    'no-empty-function': 'error',
    'no-eq-null': 'error',
    'no-eval': 'error',
    'no-implied-eval': 'error',
    'no-invalid-this': 'error',
    'no-lone-blocks': 'error',
    'no-lonely-if': 'error',
    'no-loop-func': 'error',
    'no-mixed-operators': 'error',
    'no-magic-numbers': ['error', {ignore: [-1, 0, 1], ignoreArrayIndexes: true, ignoreDefaultValues: true}],
    'no-multi-assign': ['error', {ignoreNonDeclaration: true}],
    'no-return-assign': 'error',
    'no-shadow': 'error',
    'no-undef-init': 'error',
    'no-unneeded-ternary': 'error',
    'no-unused-expressions': 'error',
    'no-useless-call': 'error',
    'no-useless-computed-key': 'error',
    'no-useless-concat': 'error',
    'no-useless-constructor': 'error',
    'no-useless-return': 'error',
    'prefer-const': 'error',
    'prefer-template': 'error',
    'yoda': 'error',
    'arrow-parens': ['error', 'always'],
    'block-spacing': 'error',
    'brace-style': 'error',
    'comma-style': ['error', 'last'],
    'eol-last': ['error', 'always'],
    'func-call-spacing': ['error', 'never'],
    'no-multiple-empty-lines': ['error', {max: 2, maxEOF: 1}],
    'react/jsx-closing-bracket-location': 'error',
    'react/jsx-tag-spacing': ['error', {beforeSelfClosing: 'never'}],
    'react/jsx-closing-tag-location': 'error',
    'react/self-closing-comp': 'error',
    'valid-jsdoc': 'off',
    'jsdoc/newline-after-description': 'error',
    'jsdoc/check-types': 'error',
    'jsdoc/require-param-description': 'off',
    'jsdoc/require-returns-description': 'off',
    'jsdoc/check-param-names': 'off',
    'jsdoc/require-param': 'off',
    'jsdoc/require-param-type': 'off',
    'require-await': 'error',
    'linebreak-style': ['error', 'unix'],
    'no-console': 'error',
    'no-debugger': 'error',
  },
  settings: {
    react: {
      version: '17.0.2',
    },
    jsdoc: {
      tagNamePreference: {
        returns: 'return',
      },
    },
  },
  reportUnusedDisableDirectives: true,
}
