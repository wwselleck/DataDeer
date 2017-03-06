const log = require('./logger')
const PLUGIN_PREFIX = 'datadeer-plugin-'

function _ensurePrefix (prefix, plugin) {
  return plugin.startsWith(prefix)
    ? plugin
    : prefix + plugin
}

const makeError = {
  noFetch (plugin) {
    return new Error(`${plugin} does not implement 'fetch' function`)
  }
}

function _verifyPluginCompat (plugin) {
  const errors = []
  if (typeof plugin !== 'function') {
    errors.push(makeError.noFetch(plugin.filename))
  }
  return errors
}

function tryRequire (id, req) {
  log.debug({id}, `Attempting to require`)
  try {
    const _module = req(id)
    log.debug(`Module ${id} found`)
    return _module
  } catch (err) {
    log.error({err}, `Could not load module ${id}`)
  }
}

function loadPlugin (pluginIdentifier) {
  log.debug(`Attemping to load plugin ${pluginIdentifier}`)
  const plugin = tryRequire(pluginIdentifier, require) ||
    tryRequire(_ensurePrefix(PLUGIN_PREFIX, pluginIdentifier), require)
  if (!plugin) {
    const err = new Error(`${pluginIdentifier} module could not be found`)
    err.errors = []
    throw err
  }
  return plugin
}

module.exports = {
  _verifyPluginCompat,
  loadPlugin
}
