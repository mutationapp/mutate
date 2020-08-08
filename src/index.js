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

const mutate = shared(injectMutate)({
  fetcher,
})

module.exports = {
  getAppFile,
  getFileName,
  getInitialFiles,
  getOriginalFileName,
  getTestFile,
  getMutationCandidates,
  toMutation,
  mutate,
}
