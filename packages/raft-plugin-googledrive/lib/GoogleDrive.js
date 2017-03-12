const Raft = require('@wwselleck/raft')
const { authenticate: gAuthenticate } = require('../auth')
const DriveAPI = require('../api/DriveAPI')
const log = require('../lib/logger.js')

class GoogleDrive {
  constructor (config) {
    this.config = config
  }

  options () {
    return {
      getData: {
        f: '_getData',
        optionTypes: {
          spreadsheets: Raft.OptionTypes.List,
          images: Raft.OptionTypes.List
        }
      }
    }
  }

  // /////////////////////////////////
  // Actions
  // /////////////////////////////////

  // // getData
  _getData (options) {
    log.debug({options}, '_getData')
    return this._prereq().then(() => {
      const ret = {}
      const promises = []
      const { spreadsheets, images } = options
      if (spreadsheets && !Array.isArray(spreadsheets)) {
        throw new Error('spreadsheets must be an array')
      }
      promises.push(this._getSpreadsheetData(spreadsheets).then(data => {
        ret.spreadsheets = data
      }))

      if (images && !Array.isArray(images)) {
        throw new Error('images must be an array')
      }
      promises.push(this._getImageData(images).then(data => {
        ret.images = data
      }))

      return Promise.all(promises).then(() => ret)
    })
  }

  _getSpreadsheetData (spreadsheets = []) {
    const { id, auth } = this.config
    return DriveAPI.loadSpreadsheetsInDirectory(id, spreadsheets, { auth }).catch(err => {
      log.error({err}, 'Failed to load spreadsheet data')
    })
  }

  _getImageData (images = []) {
    const { id, auth } = this.config
    return DriveAPI.loadImagesInDirectory(id, images, { auth }).catch(err => {
      log.error({err}, 'Failed to load images data')
    })
  }
  /*********************************************/

  _resolveAuthOpts (config) {
    let scopes = [
      'https://www.googleapis.com/auth/drive',
      'https://www.googleapis.com/auth/spreadsheets'
    ]

    return Object.assign({}, config, { scopes })
  }

  _confirmAuth () {
    const { auth, authConfig } = this.config

    if (auth) {
      log.debug('Auth found, no need to authenticate again')
      return Promise.resolve()
    }
    if (!authConfig) {
      return Promise.reject(new Error('Invalid auth config'))
    }
    log.debug('Auth not resolved, attempting to authenticate...')
    return this._authenticate(authConfig).then(_auth => {
      log.debug('Auth resolved, setting auth')
      this.config.auth = _auth
    })
  }

  _confirmID () {
    const { auth, baseDirName } = this.config
    if (this.config.id) {
      return Promise.resolve()
    }

    log.debug({baseDirName}, 'Attemping to ID')
    if (!auth) {
      return Promise.reject(new Error('Cannot resolve id without authentication'))
    }

    if (!baseDirName) {
      return Promise.reject(new Error('Cannot resolve id with current configuration'))
    }

    const q = `name='${baseDirName}'`
    return DriveAPI.searchFiles(q, {
      auth
    }).then(files => {
      if (files.length < 1) {
        throw new Error(`Base directory ${baseDirName} could not be found`)
      }
      log.debug(files)
      this.config.id = files[0].id
    })
  }

  _authenticate (authConfig) {
    const authOpts = this._resolveAuthOpts(authConfig)
    return gAuthenticate(authOpts)
  }

  _prereq () {
    log.debug({config: this.config}, 'Resolving prereqs...')
    return this._confirmAuth()
      .then(() => {
        return this._confirmID()
      })
      .catch(err => {
        log.error({err, config: this.config}, 'Error confirming auth or basedirid')
      })
  }

}

module.exports = GoogleDrive
