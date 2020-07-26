const withMatch = patterns => item => {
  if (typeof item !== 'string') {
    return false
  }

  if (!Array.isArray(patterns)) {
    return true
  }

  return patterns.some(current => item.match(current))
}

module.exports = withMatch
