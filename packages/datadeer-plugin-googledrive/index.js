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

class GoogleDriveSource {
  init (config) {
    this.config = config
  }

  _configAuth () {
    const config = this.config
    if (!this.auth) {
      if (!config.auth) {
        return Promise.reject(new Error('Invalid auth config'))
      }
      return this.authenticate()
    }
  }

  _confirmBaseDir () {
    const config = this.config
    if (!this.auth) {
      return Promise.reject(new Error('Cannot resolve base directory without authentication'))
    }

    if (!this.basedirId) {
      if (!config.basedir) {
        return Promise.reject(new Error('Invalid base directory configuration'))
      }
      const q = `name='${config.basedir}'`
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
  }

  _confirmAll () {
    this._confirmAuth().then(() => {
      return this._confirmBasedir()
    })
  }

  authenticate () {
    if (!this.config.auth) {
      return Promise.reject(new Error('No auth configuration'))
    }

    const authOpts = _resolveAuthOpts(this.config.auth)
    log.info('Attempting to authenticate...')
    return gAuthenticate(authOpts).then(auth => {
      this.auth = auth
    })
  }

  fetch () {
    this._confirmAll().then(() => {
      return DriveAPI.loadDirData(this.basedirId, {
        auth: this.auth,
        tables: this.config.data_tables,
        images: this.config.images
      })
    })
  }
}

function create (opts) {
  return new GoogleDriveSource(opts)
}

module.exports = {
  create
}

