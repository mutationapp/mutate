const toPagedList = ({ page, size }) => list => {
  if (!Array.isArray(list)) {
    return
  }

  if (!page || !size) {
    return list
  }

  return list.slice((page - 1) * size, page * size)
}

module.exports = toPagedList
