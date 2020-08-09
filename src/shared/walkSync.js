const walkSync = ({ fs, path }) => dir => {
  if (!fs.existsSync(dir)) return

  return fs.readdirSync(dir).reduce((files, file) => {
    const name = path.join(dir, file)
    const isDirectory = fs.statSync(name).isDirectory()
    return isDirectory
      ? [...files, ...walkSync({ fs, path })(name)]
      : [...files, name]
  }, [])
}

module.exports = walkSync
