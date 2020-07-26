const only = require('./only')
const unique = require('./unique')
const withMatch = require('./withMatch')
const toPagedList = require('./toPagedList')
const getFileExtension = require('./getFileExtension')
const withSearch = require('./withSearch')
const mergeDeep = require('./mergeDeep')

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

module.exports = {
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
}
