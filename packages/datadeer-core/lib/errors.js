const makeError = {
  notFunction (plugin) {
    return new Error(`${plugin} does not export function`)
  },
  pluginUndefined () {
    return new Error('Plugin undefined')
  },
  noId (plugin) {
    return new Error('No id specified')
  }
}

module.exports = {
  makeError
}
