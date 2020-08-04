const getTestFile = ({
  getAppFile,
  getFileExtension,
  getOriginalFileName,
  MATCH,
}) => fileName => {
  const appFile = getAppFile(fileName)

  if (!appFile) {
    return
  }

  const ext = getFileExtension(fileName)
  return getOriginalFileName(appFile.replace(MATCH.mutate, `.test.${ext}`))
}

module.exports = getTestFile
