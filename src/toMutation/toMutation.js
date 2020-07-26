const toMutation = ({
  getAppFile,
  getTestFile,
  getSnapshotFile,
}) => fileName => {
  const appFile = getAppFile(fileName)

  const testFile = getTestFile(fileName)
  if (!testFile) {
    return
  }

  const snapshotFile = getSnapshotFile(fileName)
  return {
    [appFile]: [testFile, snapshotFile].filter(Boolean),
  }
}

module.exports = toMutation
