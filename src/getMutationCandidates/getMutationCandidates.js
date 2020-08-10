const getMutationCandidates = ({
  getInitialFiles,
  logger,
  MATCH,
  toMutation,
  toPagedList,
  STRATEGY,
  withMatch,
  withSearch,
  unique,
}) => (payload = {}) => {
  const {
    MUTATE_MAX = 10000,
    MUTATE_SKIP = 0,
    MUTATE_SEARCH,
    MUTATE_STRATEGY = STRATEGY.changed,
    MUTATE_BRANCH = 'master',
  } = payload

  logger.info('MUTATION OPTIONS:\n', {
    MUTATE_MAX,
    MUTATE_SKIP,
    MUTATE_SEARCH,
    MUTATE_STRATEGY,
    MUTATE_BRANCH,
  })

  const size = parseInt(MUTATE_MAX)
  const page = parseInt(MUTATE_SKIP) + 1
  const search = MUTATE_SEARCH
  const strategy = MUTATE_STRATEGY
  const branch = MUTATE_BRANCH

  const defaults = {
    page,
    size,
    search,
    mutate: [],
    files: [],
  }

  const initialFiles = getInitialFiles({
    branch,
    strategy,
  })

  if (!Array.isArray(initialFiles)) {
    return defaults
  }

  const match = [MATCH.mutate, MATCH.test]

  const mutationCandidates = unique(
    initialFiles
      .filter(withMatch(match))
      .filter(withSearch(search))
      .map(x => toMutation(x))
      .filter(Boolean),
  )

  const pageCount = Math.ceil(mutationCandidates.length / size)
  const pagedList = toPagedList({ size, page })(mutationCandidates)

  const [mutate, files] = pagedList.reduce(
    (result, file) => {
      const [mutate, files] = result

      const [key] = Object.keys(file)

      const value = file[key]

      if (!value || !value.length) {
        return result
      }

      return [
        [...mutate, key],
        [...files, key, ...value],
      ]
    },
    [[], []],
  )

  return {
    ...defaults,
    pageCount,
    mutate,
    files,
  }
}

module.exports = getMutationCandidates
