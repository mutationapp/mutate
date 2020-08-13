const injectGetOriginalFileName = require('./getOriginalFileName')
const injectGetAppFile = require('./getAppFile')
const injectFetcher = require('./fetcher')
const injectGetSnapshotFile = require('./getSnapshotFile')
const injectGetFileName = require('./getFileName')
const injectGetInitialFiles = require('./getInitialFiles')
const injectGetMutationCandidates = require('./getMutationCandidates')
const injectGetTestFile = require('./getTestFile')
const injectMutation = require('./toMutation')
const injectMutate = require('./mutate')
const injectMerge = require('./merge')
const injectParse = require('./parse')
const clear = require('./clear')

const { shared } = require('./shared')

const fetcher = shared(injectFetcher)()

const getOriginalFileName = shared(injectGetOriginalFileName)()

const getFileName = shared(injectGetFileName)()
const getInitialFiles = shared(injectGetInitialFiles)()

const getAppFile = shared(injectGetAppFile)({
  getFileName,
  getOriginalFileName,
})

const getTestFile = shared(injectGetTestFile)({
  getOriginalFileName,
  getAppFile,
})

const getSnapshotFile = shared(injectGetSnapshotFile)({
  getTestFile,
  getOriginalFileName,
})

const toMutation = shared(injectMutation)({
  getAppFile,
  getTestFile,
  getSnapshotFile,
})

const getMutationCandidates = shared(injectGetMutationCandidates)({
  getInitialFiles,
  toMutation,
})

const parse = shared(injectParse)({ clear })

const merge = shared(injectMerge)({
  parse,
})

const mutate = shared(injectMutate)({
  fetcher,
  merge,
  getInitialFiles,
})

module.exports = {
  getAppFile,
  getFileName,
  getInitialFiles,
  getOriginalFileName,
  getTestFile,
  getMutationCandidates,
  toMutation,
  parse,
  merge,
  mutate,
  clear,
}
