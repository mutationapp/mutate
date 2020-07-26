const withSearch = search => item => {
  if (!item) {
    return false
  }

  if (!search) {
    return true
  }

  const keys = search
    .trim()
    .split(',')
    .map(x => x.trim())
    .filter(Boolean)

  if (!keys.length) {
    return true
  }

  return keys.some(key => item.toLowerCase().match(key.toLowerCase()))
}

module.exports = withSearch
