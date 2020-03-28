module.exports = {
  env: {
    browser: true,
    es6: true,
  },
  extends: [
    'airbnb-base',
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  rules: {
    "no-underscore-dangle": ["error", {
        "allowAfterThis": true,
    }],
    "indent": ["error", 4, {
        "SwitchCase": 1
    }],
    "prefer-destructuring": "off",
    "no-console": "off",
    "no-param-reassign": "off"
  },
};