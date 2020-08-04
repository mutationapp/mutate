const getFileExtension = fileName => {
  if (typeof fileName !== 'string') {
    return
  }

  return fileName.split('.').pop()
}

module.exports = getFileExtension
