const getSnapshotFile = ({
  getTestFile,
  getOriginalFileName,
  SNAPSHOT_DIR,
}) => fileName => {
  const path = '/'
  const testFile = getTestFile(fileName)

  if (!testFile || !testFile.includes(path)) {
    return
  }

  const paths = testFile.split(path).reverse()

  paths.splice(1, 0, SNAPSHOT_DIR)

  return getOriginalFileName(`${paths.reverse().join(path)}.snap`)
}

module.exports = getSnapshotFile
