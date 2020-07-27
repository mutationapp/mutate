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
  unique,
  only,
  withMatch,
  toPagedList,
  dealWithIt,
  somethingWentWrong,
  getFileExtension,
  withSearch,
  mergeDeep,
  MATCH,
  STRATEGY,
  SNAPSHOT_DIR,
  fs,
  fetch,
  path,
  formData: new FormData(),
  logger,
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
