const merge = ({ parse, fs, withMatch, defaultsDeep, walkSync }) => ({
  MUTATE_FILE_PATH,
  escape = null,
}) => {
  const last = MUTATE_FILE_PATH.lastIndexOf('/')

  const folder = MUTATE_FILE_PATH.substr(0, last)
  const file = MUTATE_FILE_PATH.substr(last + 1, MUTATE_FILE_PATH.length)

  const files = walkSync(folder)
  if (!Array.isArray(files) || !files.length) {
    return
  }

  return files.filter(withMatch([file])).reduce((acc, current) => {
    return defaultsDeep(
      acc,
      parse({ value: fs.readFileSync(current, { encoding: 'utf8' }), escape }),
    )
  }, undefined)
}

module.exports = merge
