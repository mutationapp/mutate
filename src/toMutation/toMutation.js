const toMutation = ({ getAppFile, getTestFile, getSnapshotFile }) => (
  // result = [],
  fileName,
) => {
  const appFile = getAppFile(fileName)

  // if (!appFile || result.some(item => item && item.hasOwnProperty(appFile))) {
  //   return result
  // }

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
