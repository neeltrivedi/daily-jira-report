module.exports = {
  env: {
    browser: true,
    es6: true,
    node: true
  },
  "plugins": [
        "promise"
    ],
  extends: "eslint:recommended",
  parserOptions: {
    sourceType: "module"
  },
  rules: {
    "arrow-spacing": 2,
    "comma-spacing": 2,
    "comma-style": 2,
    "dot-notation": 2,
    "eqeqeq": 2,
    "keyword-spacing": 2,
    "linebreak-style": 0,
    "no-console": 0,
    "no-else-return": 0,
    "no-multi-spaces": 2,
    "no-undef": 2,
    "no-unreachable": 2,
    "no-unused-vars": [2, { varsIgnorePattern: "^_", argsIgnorePattern: "^_" }],
    "no-useless-constructor": 2,
    "no-var": 2,
    "object-curly-spacing": [2, "always"],
    "object-shorthand": 2,
    "prefer-arrow-callback": 1,
    "quotes": [0, "backtick"],
    "semi": 0,
    "space-in-parens": [2, "never"],
    "space-infix-ops": 2,
    "strict": 0,
    "promise/always-return": "error",
        "promise/no-return-wrap": "error",
        "promise/param-names": "error",
        "promise/catch-or-return": "error",
        "promise/no-native": "off",
        "promise/no-nesting": "warn",
        "promise/no-promise-in-callback": "warn",
        "promise/no-callback-in-promise": "warn",
        "promise/avoid-new": "warn"
  }
};
