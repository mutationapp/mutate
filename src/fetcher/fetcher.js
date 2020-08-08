const fetcher = ({ fetch, ApiError }) => async (input, init) => {
  const response = await fetch(input, init)

  const result = await (async () => {
    try {
      return await response.json()
    } catch (error) {
      throw new ApiError(0, 'Invalid Response', {})
    }
  })()

  if (!response.ok) {
    const { error, data } = result || {}

    throw new ApiError(response.status, error, data)
  }

  return result
}

module.exports = fetcher
