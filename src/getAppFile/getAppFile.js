const getAppFile = ({ getFileName, getOriginalFileName }) => fileName =>
  getOriginalFileName(getFileName(fileName))

module.exports = getAppFile
