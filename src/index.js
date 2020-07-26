const injectGetOriginalFileName = require('./getOriginalFileName')
const injectGetAppFile = require('./getAppFile')
const injectGetSnapshotFile = require('./getSnapshotFile')
const injectGetFileName = require('./getFileName')
const injectGetInitialFiles = require('./getInitialFiles')
const injectGetMutationCandidates = require('./getMutationCandidates')
const injectGetTestFile = require('./getTestFile')
const injectMutation = require('./toMutation')
const injectMutate = require('./mutate')

const fs = require('fs')
const fetch = require('node-fetch')
const path = require('path')
const FormData = require('form-data')
const logger = console

const {
  only,
  withMatch,
  toPagedList,
  unique,
  getFileExtension,
  withSearch,
  MATCH,
  STRATEGY,
  SNAPSHOT_DIR,
} = require('./shared')

const { execSync } = require('child_process')

const getOriginalFileName = injectGetOriginalFileName({
  fs,
  path,
})

const getFileName = injectGetFileName({ MATCH, SNAPSHOT_DIR })

const getInitialFiles = injectGetInitialFiles({ STRATEGY, unique, execSync })
const getAppFile = injectGetAppFile({ getFileName, getOriginalFileName })

const getTestFile = injectGetTestFile({
  getOriginalFileName,
  getAppFile,
  getFileExtension,
  MATCH,
})

const getSnapshotFile = injectGetSnapshotFile({
  getTestFile,
  getOriginalFileName,
  SNAPSHOT_DIR,
})

const toMutation = injectMutation({
  getAppFile,
  getTestFile,
  getSnapshotFile,
})

const getMutationCandidates = injectGetMutationCandidates({
  getInitialFiles,
  withMatch,
  toPagedList,
  only,
  logger,
  MATCH,
  STRATEGY,
  toMutation,
  withSearch,
})

const mutate = injectMutate({
  logger,
  only,
  fs,
  fetch,
  path,
  formData: new FormData(),
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
