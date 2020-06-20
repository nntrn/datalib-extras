function flattenObject(obj) {
  var flat = {}

  obj && Object.keys(obj) && Object.keys(obj).forEach(key => {
    if (typeof obj[key] === 'object') {
      const flatObject = flattenObject(obj[key])

      Object.keys(flatObject).forEach(e => {
        const propName = `${key}_${e}`
        flat[propName] = flatObject[e]
      })
    } else {
      flat[key] = obj[key]
    }
  })
  return flat
}

module.exports = flattenObject

