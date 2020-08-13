const mutate = ({
  STRATEGY,
  getInitialFiles,
  JSON,
  Buffer,
  only,
  fetcher,
  formData,
  logger,
  process,
  merge,
}) => async ({
  MUTATE_API_URL,
  MUTATE_REPOSITORY_TOKEN,
  MUTATE_PULL_NUMBER,
  MUTATE_PULL_OWNER,
  MUTATE_FILE_PATH,
  INIT_CWD,
  ...rest
}) => {
  const MUTATE_BRANCH = rest.MUTATE_BRANCH || 'master'

  const nil = only(
    {
      MUTATE_API_URL,
      MUTATE_REPOSITORY_TOKEN,
      MUTATE_PULL_NUMBER,
      MUTATE_PULL_OWNER,
      MUTATE_FILE_PATH,
      INIT_CWD,
      MUTATE_BRANCH,
    },
    x => x == null,
  )

  if (nil) {
    logger.error('REQUIRED:', nil)
    return process.exit(1)
  }

  const escape = INIT_CWD

  const file = merge({ MUTATE_FILE_PATH, escape })

  if (!file) {
    logger.info('NO REPORT FILE FOUND IN DIRECTORY:', { MUTATE_FILE_PATH })
    return process.exit(1)
  }

  const deletedFiles = getInitialFiles({
    branch: MUTATE_BRANCH,
    strategy: STRATEGY.deleted,
  })
  console.log(
    `deletedFiles`,
    'meta',
    JSON.stringify({
      directory: escape,
      deletedFiles,
    }),
  )

  formData.append('repositoryToken', MUTATE_REPOSITORY_TOKEN)
  formData.append('pullNumber', MUTATE_PULL_NUMBER)
  formData.append('pullOwner', MUTATE_PULL_OWNER)
  formData.append(
    'meta',
    JSON.stringify({
      directory: escape,
      deletedFiles,
    }),
  )
  formData.append('file', Buffer.from(JSON.stringify(file)))

  const result = await fetcher(MUTATE_API_URL, {
    method: 'POST',
    headers: {
      ...formData.getHeaders(),
    },
    body: formData,
  })

  logger.info(result.info, result.url)
}

module.exports = mutate
