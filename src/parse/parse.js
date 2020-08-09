const parse = ({ clear, JSON, removeProp }) => ({ value, escape = null }) => {
  try {
    const json = JSON.parse(clear({ value, escape }))

    json && removeProp(json, 'source')

    return json
  } catch (error) {
    return {}
  }
}

module.exports = parse
