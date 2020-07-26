const getOriginalFileName = ({ fs, path }) => filePath => {
  if (!filePath) {
    return
  }

  const dirname = path.dirname(filePath)
  if (!fs.existsSync(dirname)) {
    return
  }
  const fileNames = fs.readdirSync(dirname)

  const baseName = path.basename(filePath).toLowerCase()
  const file = fileNames.find(name => name.toLowerCase() === baseName)

  if (!file) {
    return
  }

  return path.join(dirname, file)
}

module.exports = getOriginalFileName
