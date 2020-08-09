const removeProp = (obj, propName) => {
  for (prop in obj) {
    if (prop === propName) {
      delete obj[prop]
      return
    }

    if (typeof obj[prop] === 'object') removeProp(obj[prop], propName)
  }
}

module.exports = removeProp
