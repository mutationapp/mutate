const getFileExtension = fileName => {
  if (!fileName) {
    return
  }

  return fileName.split('.').pop()
}

module.exports = getFileExtension
