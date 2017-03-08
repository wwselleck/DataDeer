const Source = require('./Source')
let DriveAPI = require('../api/DriveAPI')
let log = require('../lib/logger.js')

class Directory extends Source {
  get (getters) {

  }

  options () {
    return this.prereq().then(() => {
      const { auth, parentId } = this.config
      log.error(parentId)
      const { SHEET } = DriveAPI.MIME_TYPES
      return DriveAPI.searchFiles(
        `'${parentId}' in parents and mimeType = '${SHEET}'`,
        { auth }
      ).then(files => {
        log.info(files)
      }).catch(err => {
        log.error(err)
      })
    })
  }

  fetch () {
    log.debug('Confirming auth and basedirId...')
    return this._confirmAll().then(() => {
      const {
        tables,
        images
      } = this.config
      const { auth, basedirId } = this
      log.debug('Confirmed, fetching data')
      return DriveAPI.loadDirData(basedirId, {
        auth,
        tables,
        images
      }).then(data => {
        log.debug({data}, 'Data fetched')
        return data
      })
    })
  }
}

module.exports = Directory
