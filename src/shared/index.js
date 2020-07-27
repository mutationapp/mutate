const only = require('./only')
const unique = require('./unique')
const withMatch = require('./withMatch')
const toPagedList = require('./toPagedList')
const getFileExtension = require('./getFileExtension')
const withSearch = require('./withSearch')
const mergeDeep = require('./mergeDeep')

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
  js: /.[jt]sx?$/,
}

const STRATEGY = {
  all: 'all',
  changed: 'changed',
}

const SNAPSHOT_DIR = '__snapshots__'

const common = {
  dealWithIt,
  execSync,
  fetch,
  formData: new FormData(),
  fs,
  getFileExtension,
  logger,
  MATCH,
  mergeDeep,
  only,
  path,
  SNAPSHOT_DIR,
  somethingWentWrong,
  STRATEGY,
  toPagedList,
  unique,
  withMatch,
  withSearch,
}

const shared = inject => overrides =>
  inject({
    ...common,
    ...overrides,
  })

module.exports = {
  ...common,
  shared,
}
