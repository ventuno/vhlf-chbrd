const OFF = 0;
const WARNING = 1;
const ERROR = 2;

module.exports = {

  extends: ["eslint:recommended"],

  plugins: [
    'html'
  ],
  parser: "babel-eslint",

  parserOptions: {
    ecmaFeatures: {
      modules: true
    },
  },

  env: {
    node: true,
    browser: true
  },

  rules: {
    'accessor-pairs': OFF,
    'brace-style': [ERROR, '1tbs'],
    'comma-dangle': [ERROR, 'always-multiline'],
    'consistent-return': ERROR,
    'dot-location': [ERROR, 'property'],
    'dot-notation': ERROR,
    'eol-last': ERROR,
    'eqeqeq': [ERROR, 'allow-null'],
    'indent': [ERROR, 2, {SwitchCase: 1}],
    'jsx-quotes': [ERROR, 'prefer-double'],
    'no-bitwise': OFF,
    'no-inner-declarations': [ERROR, 'functions'],
    'no-multi-spaces': ERROR,
    'no-restricted-syntax': [ERROR, 'WithStatement'],
    'no-shadow': ERROR,
    'no-unused-expressions': ERROR,
    'no-unused-vars': [ERROR, {args: 'none'}],
    'quotes': [ERROR, 'single', 'avoid-escape'],
    'keyword-spacing': ERROR,
    'space-before-blocks': ERROR,
    'space-before-function-paren': [ERROR, {anonymous: 'never', named: 'never'}],
    'strict': [ERROR, 'global']
  }
};
