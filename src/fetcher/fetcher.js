const fetcher = ({ fetch, ApiError }) => async (input, init) => {
  const response = await fetch(input, {
    ...init,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...init.headers,
    },
  })

  const result = await (async () => {
    try {
      return await response.json()
    } catch (error) {
      throw new ApiError(0, 'Invalid Response', {})
    }
  })()

  if (!response.ok) {
    const result = response || {}

    throw new ApiError(result.status, response.error, response.data)
  }

  return result
}

module.exports = fetcher
