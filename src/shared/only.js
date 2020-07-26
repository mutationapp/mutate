const only = (obj, predicate) =>
  obj
    ? Object.entries(obj).reduce(
        (acc, [key, value]) =>
          predicate(value)
            ? {
                ...(acc || {}),
                [key]: value,
              }
            : acc,
        undefined,
      )
    : predicate(obj)

module.exports = only
