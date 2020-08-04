const mutate = ({
  only,
  fetch,
  fs,
  path,
  formData,
  logger,
  process,
}) => async ({
  MUTATE_API_URL,
  MUTATE_REPOSITORY_TOKEN,
  MUTATE_PULL_NUMBER,
  MUTATE_PULL_OWNER,
  MUTATE_FILE_PATH,
  INIT_CWD,
}) => {
  const nil = only(
    {
      MUTATE_API_URL,
      MUTATE_REPOSITORY_TOKEN,
      MUTATE_PULL_NUMBER,
      MUTATE_PULL_OWNER,
      MUTATE_FILE_PATH,
      INIT_CWD,
    },
    x => x == null,
  )

  if (nil) {
    logger.error('REQUIRED:', nil)
    return process.exit(1)
  }

  const filePath = [MUTATE_FILE_PATH]
    .map(file => path.join(INIT_CWD, file))
    .find(path => fs.existsSync(path))

  if (!filePath) {
    logger.info('NO REPORT FILE FOUND IN DIRECTORY:', { MUTATE_FILE_PATH })
    return process.exit(1)
  }

  formData.append('repositoryToken', MUTATE_REPOSITORY_TOKEN)
  formData.append('pullNumber', MUTATE_PULL_NUMBER)
  formData.append('pullOwner', MUTATE_PULL_OWNER)
  formData.append('escape', INIT_CWD + '/')
  formData.append('file', fs.createReadStream(filePath))

  const response = await fetch(MUTATE_API_URL, {
    method: 'POST',
    headers: {
      ...formData.getHeaders(),
      'Content-Type': 'application/json',
    },
    body: formData,
  })

  const result = await (async () => {
    const text = await response.text()
    if (!text) {
      return
    }

    try {
      return JSON.parse(text)
    } catch (error) {}
  })()

  if (!result) {
    logger.error('RESPONSE IS INVALID:', { result })
    return process.exit(1)
  }

  if (!response.ok) {
    logger.error(response.status, result.error)
    return process.exit(1)
  }

  logger.info('RESPONSE:', result.info, result.url)
}

module.exports = mutate
