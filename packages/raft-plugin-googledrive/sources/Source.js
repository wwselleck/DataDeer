const { RaftDataSource } = require('@wwselleck/raft')
const { authenticate: gAuthenticate } = require('../auth')
const DriveAPI = require('../api/DriveAPI')
const log = require('../lib/logger.js')

class Source extends RaftDataSource {
  _resolveAuthOpts (config) {
    let scopes = [
      'https://www.googleapis.com/auth/drive',
      'https://www.googleapis.com/auth/spreadsheets'
    ]

    return Object.assign({}, config, { scopes })
  }

  _confirmAuth () {
    const auth = this.auth
    const { authConfig } = this.config

    if (auth) {
      log.debug('Auth found, no need to authenticate again')
      return Promise.resolve()
    }
    if (!authConfig) {
      return Promise.reject(new Error('Invalid auth config'))
    }
    log.debug('Auth not resolved, attempting to authenticate...')
    return this.authenticate(authConfig).then(_auth => {
      log.debug('Auth resolved, setting auth')
      this.config.auth = _auth
    })
  }

  _confirmParentId () {
    const { auth, basedir } = this.config
    if (this.basedirId) {
      return Promise.resolve()
    }

    log.debug({basedir}, 'Attemping to resolve basedirId')
    if (!auth) {
      return Promise.reject(new Error('Cannot resolve base directory without authentication'))
    }

    if (!basedir) {
      return Promise.reject(new Error('Invalid base directory configuration'))
    }

    const q = `name='${basedir}'`
    return DriveAPI.searchFiles(q, {
      auth
    }).then(files => {
      if (files.length < 1) {
        throw new Error(`Base directory ${basedir} could not be found`)
      }
      log.debug(files)
      this.config.parentId = files[0].id
    })
  }

  authenticate (authConfig) {
    const authOpts = this._resolveAuthOpts(authConfig)
    return gAuthenticate(authOpts)
  }

  prereq () {
    return this._confirmAuth()
      .then(() => {
        return this._confirmParentId()
      })
      .catch(err => {
        log.error({err, config: this.config}, 'Error confirming auth or basedirid')
      })
  }
}

module.exports = Source
