const clear = ({ value, escape = null }) => {
  const trimmed = value.trim()

  const fix = escape ? escape.replace(/\/+$/, '') + '/' : undefined

  const first = trimmed.indexOf('{')
  const last = trimmed.lastIndexOf('}') + 1

  const sliced = trimmed.slice(first, last)

  return fix ? sliced.replace(new RegExp(fix, 'g'), '/') : sliced
}

module.exports = clear
