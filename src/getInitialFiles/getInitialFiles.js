const getInitialFiles = ({ STRATEGY, unique, execSync }) => ({
  strategy,
  branch,
}) => {
  const command = (() => {
    if (strategy === STRATEGY.all) {
      return 'git ls-files --others --exclude-standard --cached'
    }

    const target = branch || 'master'
    const remote =
      (() => {
        const buffer = execSync('git remote show -n')
        const result = buffer.toString()
        return result ? result.trim() : undefined
      })() || 'origin'

    execSync(`git fetch ${remote} ${target}`)

    return `git diff ${remote}/${target}${
      strategy === STRATEGY.deleted ? ' --diff-filter=D' : ''
    } --name-only`
  })()

  console.info(`EXECUTING:\n"${command}"`)

  const buffer = execSync(command)
  const toString = buffer.toString()

  if (!toString) {
    return
  }

  return unique(toString.trim().split('\n'))
}

module.exports = getInitialFiles
