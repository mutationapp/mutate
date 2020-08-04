const getFileName = ({
  MATCH,
  SNAPSHOT_DIR,
  getFileExtension,
  removeFileExtension,
}) => fileName => {
  if (typeof fileName !== 'string') {
    return
  }

  if (fileName.match(MATCH.test)) {
    return fileName.replace(MATCH.test, `.${getFileExtension(fileName)}`)
  }

  if (fileName.match(MATCH.snapshot)) {
    return fileName
      .replace(`${SNAPSHOT_DIR}/`, '')
      .replace(
        MATCH.snapshot,
        `.${getFileExtension(removeFileExtension(fileName))}`,
      )
  }

  if (!fileName.match(MATCH.mutate)) {
    return
  }

  return fileName
}

module.exports = getFileName
