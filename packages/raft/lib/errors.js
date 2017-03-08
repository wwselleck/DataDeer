const makeError = {
  notFunction (plugin) {
    return new Error(`${plugin} does not export function`)
  },
  sourceUndefined () {
    return new Error('Source undefined')
  },
  noId (plugin) {
    return new Error('No id specified')
  }
}

module.exports = {
  makeError
}
