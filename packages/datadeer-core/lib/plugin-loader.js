const log = require('./logger')

const makeError = {
  noFetch (plugin) {
    return new Error(`${plugin} does not implement 'fetch' function`)
  }
}

function _verifyPluginCompat (plugin) {
  const errors = []
  if (typeof plugin.fetch !== 'function') {
    errors.push(makeError.noFetch(plugin.filename))
  }
  return errors
}

function tryRequire (id, req) {
  try {
    const _module = req(id)
    return _module
  } catch (e) {
    return undefined
  }
}

function loadPlugin (opts) {
  const { pluginIdentifier } = opts

  const plugin = tryRequire(pluginIdentifier, require)
  const errors = _verifyPluginCompat(plugin)
  errors.forEach(err => {
    log.error(err)
  })
  return plugin
}

module.exports = {
  _verifyPluginCompat,
  loadPlugin
}
