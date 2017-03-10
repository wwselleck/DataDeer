const { authenticate: gAuthenticate } = require('../auth')
const DriveAPI = require('../api/DriveAPI')
const SheetsAPI = require('../api/SheetsAPI')
const Spreadsheet = require('./Spreadsheet')
const log = require('../lib/logger.js')

class GoogleDrive {
  constructor (config) {
    this.config = config
  }

  options () {
    return {
      extractData: {
        f: '_getData'
      }
    }
  }

  // /////////////////////////////////
  // Actions
  // /////////////////////////////////

  // // extractData
  _getData (options) {
    log.debug({options}, '_getData')
    return this._prereq().then(() => {
      const { spreadsheets } = options
      return this._getSpreadsheetData(spreadsheets)
    })
  }

  _getSpreadsheetsFromFiles (files) {
    log.debug({files}, 'Attemping to get spreadsheets from files')
    const { auth } = this.config
    return Promise.all(files.map(f => {
      return SheetsAPI.getSpreadsheet(f.id, { auth }).then(spreadsheet => {
        return {
          name: f.name,
          spreadsheet
        }
      })
    }))
  }

  _getSpreadsheetData (spreadsheetNames) {
    const { id, auth } = this.config
    const { SHEET } = DriveAPI.MIME_TYPES
    return DriveAPI.searchFiles(
      `'${id}' in parents and mimeType = '${SHEET}'`,
      { auth }
    ).then(files => {
      log.debug({files}, 'Spreadsheet files fetched')
      return this._getSpreadsheetsFromFiles(
        files.filter(f => spreadsheetNames.includes(f.name))
      )
    }).then(spreadsheets => {
      log.debug('Spreadsheets fetched')
      const ret = {}
      spreadsheets.forEach(s => {
        console.log(s)
        ret[s.name] = Spreadsheet.extractData(s.spreadsheet)
      })
      return ret
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
