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
  return getOriginalFileName(appFile.replace(MATCH.js, `.test.${ext}`))
}

module.exports = getTestFile
