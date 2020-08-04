const removeFileExtension = fileName => {
  if (typeof fileName !== 'string') {
    return
  }

  return fileName.replace(/\.[^/.]+$/, '')
}

module.exports = removeFileExtension
