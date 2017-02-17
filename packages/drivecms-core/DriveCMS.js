let DriveAPI = require('./api/DriveAPI')
let { authenticate: gAuthenticate } = require('./auth')
let log = require('./lib/logger.js')

function _resolveAuthOpts (config) {
  let { service_auth: serviceAuth, oauth_auth: oauthAuth } = config
  let scopes = [
    'https://www.googleapis.com/auth/drive',
    'https://www.googleapis.com/auth/spreadsheets'
  ]

  let opts
  if (serviceAuth) {
    opts = serviceAuth
    opts.mode = 'service'
  } else if (oauthAuth) {
    opts = oauthAuth
    opts.mode = 'oauth'
  } else {
    throw new Error('Could not resolve configuration')
  }
  opts.scopes = scopes
  return opts
}

function authenticate (config) {
  const authOpts = _resolveAuthOpts(config)
  log.info({authOpts}, 'Attempting to authenticate...')
  return gAuthenticate(authOpts)
}

function resolveBasedirId ({name, id, auth}) {
  if (id) {
    return Promise.resolve(id)
  }

  const q = `name='${name}'`
  return DriveAPI.searchFiles(q, {
    auth: this.auth
  }).then(files => {
    if (files.length < 1) {
      throw new Error(`Base directory ${this.config.basedir} could not be found`)
    }
    log.debug(files)
    this.basedirId = files[0].id
  })
}

function fetch ({basedir, basedirId, auth, tables, images}) {
  const doFetch = () => {
    return DriveAPI.loadDirData(this.basedirId, {
      auth: this.auth,
      tables: this.config.data_tables,
      images: this.config.images
    })
  }

  if (!this.basedirId) {
    return resolveBasedirId().then(() => doFetch())
  } else {
    return doFetch()
  }
}

function withDefaults (saveOpts) {
  let defaults = saveOpts
  return (opts) => {
    const promises = []
    if (!defaults.basedirId && defaults.basedir) {
      promises.push(resolveBasedirId(defaults.basedir).then((id) => {
        defaults.basedirId = id
      }))
    }

    if (!defaults.auth && defaults.authConfig) {
      promises.push(authenticate(defaults.authConfig))
    }
    return Promise.all(promises).then(() => {
      fetch(Object.assign({}, defaults, opts))
    })
  }
}

module.exports = {
  fetch,
  withDefaults,
  default: fetch
}

