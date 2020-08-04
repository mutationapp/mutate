const getFileName = ({ MATCH, SNAPSHOT_DIR }) => fileName => {
  if (typeof fileName !== 'string') {
    return
  }

  if (fileName.match(MATCH.test)) {
    return fileName.replace(MATCH.test, '.js')
  }

  if (fileName.match(MATCH.snapshot)) {
    return fileName
      .replace(`${SNAPSHOT_DIR}/`, '')
      .replace(MATCH.snapshot, '.js')
  }

  if (!fileName.match(MATCH.mutate)) {
    return
  }

  return fileName
}

module.exports = getFileName
