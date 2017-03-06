let DriveAPI = require('./api/DriveAPI')
let { authenticate: gAuthenticate } = require('./auth')
let log = require('./lib/logger.js')

class GoogleDrive {
  constructor (config) {
    this.config = config
  }

  _resolveAuthOpts (config) {
    let scopes = [
      'https://www.googleapis.com/auth/drive',
      'https://www.googleapis.com/auth/spreadsheets'
    ]

    return Object.assign({}, config, { scopes })
  }

  _confirmAuth (auth, authConfig) {
    if (auth) {
      return Promise.resolve(auth)
    }
    if (!authConfig) {
      return Promise.reject(new Error('Invalid auth config'))
    }
    return this.authenticate(authConfig)
  }

  _confirmBaseDirId (basedirId, basedirName, { auth }) {
    if (basedirId) {
      return basedirId
    }

    log.debug({basedirName}, 'Attemping to resolve basedirId')
    if (!auth) {
      return Promise.reject(new Error('Cannot resolve base directory without authentication'))
    }

    if (!basedirName) {
      return Promise.reject(new Error('Invalid base directory configuration'))
    }

    const q = `name='${basedirName}'`
    return DriveAPI.searchFiles(q, {
      auth
    }).then(files => {
      if (files.length < 1) {
        throw new Error(`Base directory ${basedirName} could not be found`)
      }
      log.debug(files)
      return files[0].id
    })
  }

  _confirmAll () {
    const { authConfig, basedir } = this.config
    const { auth, basedirId } = this
    return this._confirmAuth(auth, authConfig)
      .then(_auth => {
        this.auth = _auth
        return this._confirmBaseDirId(basedirId, basedir, { auth: this.auth })
      })
      .then(_basedirId => {
        this.basedirId = _basedirId
      })
  }

  authenticate (authConfig) {
    const authOpts = this._resolveAuthOpts(authConfig)
    log.info('Attempting to authenticate...')
    return gAuthenticate(authOpts)
  }

  fetch () {
    return this._confirmAll().then(() => {
      const {
        tables,
        images
      } = this.config
      const { auth, basedirId } = this
      return DriveAPI.loadDirData(basedirId, {
        auth,
        tables,
        images
      })
    })
  }
}

module.exports = (config) => {
  return (rpi) => {
    rpi.addDataSource(config.id, new GoogleDrive(config))
  }
}
