/**
 * @type {import('@stryker-mutator/api/core').StrykerOptions}
 */

const { getMutationCandidates } = require('./src')

const { files, mutate } = getMutationCandidates()
console.log('MUTATION CANDIDATES\n', mutate)

module.exports = {
  files: files.length ? ['jest/**/*.js', '**/shared/*.js', ...files] : [],
  mutate,
  mutator: 'javascript',
  packageManager: 'yarn',
  reporters: ['html', 'clear-text', 'progress'],
  testRunner: 'jest',
  transpilers: [],
  coverageAnalysis: 'off',
}
