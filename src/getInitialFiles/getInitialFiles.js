const getInitialFiles = ({ STRATEGY, unique, execSync }) => ({
  strategy,
  branch,
}) => {
  const command = (() => {
    if (strategy === STRATEGY.all) {
      return 'git ls-files --others --exclude-standard --cached'
      // return 'git ls-files --others --exclude-standard --cached "*.ts"'
    }

    const target = branch || 'master'
    const remote =
      (() => {
        const buffer = execSync('git remote show -n')
        const result = buffer.toString()
        return result ? result.trim() : undefined
      })() || 'origin'

    execSync(`git fetch ${remote} ${target}`)

    return `git diff --name-only ${remote}/${target}`
    // return `git diff --name-only ${remote}/${target} "*.js"`
  })()

  console.info(`EXECUTING:\n"${command}"`)

  const buffer = execSync(command)
  const toString = buffer.toString()

  if (!toString) {
    return
  }

  return toString.trim().split('\n').filter(unique)
}

module.exports = getInitialFiles
