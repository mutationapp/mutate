class ApiError extends Error {
  constructor(status, message, data) {
    super(message)

    this.name = 'ApiError'
    this.data = data
    this.status = status
  }
}

module.exports = ApiError
