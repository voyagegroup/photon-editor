module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: 'xo-space',
  overrides: [
    {
      extends: [
        'xo-typescript/space',
      ],
      files: [
        '*.ts',
        '*.tsx',
      ],
    },
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  rules: {
  },
};
