const compilerOptions = require('./tsconfig.json').compilerOptions

module.exports = (wallaby) => ({
  tests: ['src/**/*.test.tsx', 'src/**/*.test.ts'],
  testFramework: 'jest',
  autoDetect: true,
  env: {
    type: 'node',
  },
  compilers: {
    '**/*.ts?(x)': wallaby.compilers.typeScript(compilerOptions),
  },
  runMode: 'onSave',
  debug: true,
})
