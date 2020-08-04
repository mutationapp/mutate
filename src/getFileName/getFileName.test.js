const injectGetFileName = require('./getFileName')
const { shared, SNAPSHOT_DIR } = require('../shared')

test.each([
  null,
  'appFile.test.js',
  `${SNAPSHOT_DIR}/appFile.test.js.snap`,
  'NOPE',
  'appFile.js',
])('getAppFile: %s', fileName => {
  const getFileName = shared(injectGetFileName)()

  expect(getFileName(fileName)).toMatchSnapshot()
})
