module.exports = {
  root: true,
  env: {
    node: true,
    'vue/setup-compiler-macros': true
  },
  extends: [
    'eslint:recommended',
    'plugin:vue/vue3-recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier',
    'plugin:prettier/recommended'
  ],
  plugins: ['vue', 'html', 'prettier'],
  parserOptions: {
    ecmaVersion: 8,
    parser: '@typescript-eslint/parser'
  },
  rules: {
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-empty-function': [
      'warn',
      {
        allow: ['asyncMethods', 'methods', 'arrowFunctions']
      }
    ],
    '@typescript-eslint/no-unused-vars': [
      'warn',
      {
        vars: 'local',
        argsIgnorePattern: '^_',
        caughtErrorsIgnorePattern: '^ignore',
        varsIgnorePattern: '[iI]gnored'
      }
    ],
    '@typescript-eslint/no-non-null-assertion': 'off',
    'linebreak-style': 'off',
    'no-console': 'off',
    'no-debugger': 'off',
    'vue/no-multiple-template-root': 'off',
    'vue/multi-word-component-names': 'off',
    'no-mutating-props': 'off',
    'vue/no-v-html': 'off',
    'prettier/prettier': ['warn']
  },
  overrides: [
    {
      files: ['**/__tests__/*.{j,t}s?(x)', '**/tests/unit/**/*.spec.{j,t}s?(x)'],
      env: {
        mocha: true
      }
    }
  ],
  parser: 'vue-eslint-parser'
}
