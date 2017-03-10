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

  confirmAuth () {
    const { auth, authConfig } = this.config

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

  confirmID () {
    const { auth, name } = this.config
    if (this.config.id) {
      return Promise.resolve()
    }

    log.debug({name}, 'Attemping to ID')
    if (!auth) {
      return Promise.reject(new Error('Cannot resolve id without authentication'))
    }

    if (!name) {
      return Promise.reject(new Error('Cannot resolve id with current configuration'))
    }

    const q = `name='${name}'`
    return DriveAPI.searchFiles(q, {
      auth
    }).then(files => {
      if (files.length < 1) {
        throw new Error(`Base directory ${name} could not be found`)
      }
      log.debug(files)
      this.config.id = files[0].id
    })
  }

  authenticate (authConfig) {
    const authOpts = this._resolveAuthOpts(authConfig)
    return gAuthenticate(authOpts)
  }

  prereq () {
    return this.confirmAuth()
      .then(() => {
        return this.confirmID()
      })
      .catch(err => {
        log.error({err, config: this.config}, 'Error confirming auth or basedirid')
      })
  }
}

module.exports = Source
