const only = require('./only')
const unique = require('./unique')
const withMatch = require('./withMatch')
const toPagedList = require('./toPagedList')
const getFileExtension = require('./getFileExtension')
const withSearch = require('./withSearch')
const defaultsDeep = require('lodash.defaultsdeep')

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
}

const SNAPSHOT_DIR = '__snapshots__'

const common = {
  dealWithIt,
  defaultsDeep,
  execSync,
  fetch,
  formData: new FormData(),
  fs,
  getFileExtension,
  logger,
  MATCH,
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

const shared = inject => overrides => inject(defaultsDeep(overrides, common))

module.exports = {
  ...common,
  shared,
}
