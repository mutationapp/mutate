const ApiError = require('./apiError')
const only = require('./only')
const withMatch = require('./withMatch')
const removeProp = require('./removeProp')
const injectWalkSync = require('./walkSync')
const toPagedList = require('./toPagedList')
const getFileExtension = require('./getFileExtension')
const removeFileExtension = require('./removeFileExtension')
const withSearch = require('./withSearch')
const { defaultsDeep, uniqWith, isEqual } = require('lodash')

const unique = require('./unique')({ uniqWith, isEqual })
const fs = require('fs')
const fetch = require('node-fetch')
const path = require('path')
const FormData = require('form-data')
const { execSync } = require('child_process')

const logger = console

const dealWithIt = value => (value ? `${value} (▀̿Ĺ̯▀̿ ̿).` : '(▀̿Ĺ̯▀̿ ̿)')
const somethingWentWrong = dealWithIt('Something went wrong')

const MATCH = {
  test: /.test.[jt]sx?$/,
  snapshot: /.test.[jt]sx?.snap$/,
  mutate: /.[jt]sx?$/,
}

const STRATEGY = {
  all: 'all',
  changed: 'changed',
  deleted: 'deleted',
}

const SNAPSHOT_DIR = '__snapshots__'

const walkSync = injectWalkSync({ fs, path })

const common = {
  ApiError,
  Buffer,
  dealWithIt,
  defaultsDeep,
  execSync,
  fetch,
  formData: new FormData(),
  fs,
  getFileExtension,
  JSON,
  logger,
  MATCH,
  only,
  path,
  process,
  removeFileExtension,
  removeProp,
  SNAPSHOT_DIR,
  somethingWentWrong,
  STRATEGY,
  toPagedList,
  unique,
  walkSync,
  withMatch,
  withSearch,
}

const shared = inject => overrides => inject(defaultsDeep(overrides, common))

module.exports = {
  ...common,
  shared,
}
