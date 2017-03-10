const Source = require('./Source')
const { RaftDataSource } = require('@wwselleck/raft')
const Spreadsheet = require('./Spreadsheet')
const DriveAPI = require('../api/DriveAPI')
const log = require('../lib/logger.js')

class Directory extends Source {
  _getChildrenFiles () {
    const { auth, id } = this.config
    const { SHEET } = DriveAPI.MIME_TYPES
    return DriveAPI.searchFiles(
      `'${id}' in parents and mimeType = '${SHEET}'`,
      { auth }
    )
  }

  options () {
    return this.spreadsheets().then(spreadsheets => {
      return {
        spreadsheets: RaftDataSource.fromObj(spreadsheets)
      }
    })
  }

  spreadsheets () {
    return this.prereq().then(() => {
      const { auth } = this.config
      return this._getChildrenFiles().then(files => {
        const children = {}
        files.forEach(file => {
          children[file.name] = new Spreadsheet({
            auth,
            id: file.id
          })
        })
        return children
      }).catch(err => {
        log.error(err)
      })
    })
  }

  /**
   * @param {object} opts - options
   * @property {array} children - Children to fetch from
   * @property
   */
  data (opts) {
    opts = opts || this.config.default
    return this.prereq().then(() => {
      const { spreadsheets, images } = opts
      return this.children().then(children => {
        let promises = []
        const ret = {}
        promises = promises.concat(spreadsheets.map(name => {
          return children[name].data().then(data => {
            ret[name] = data
          })
        }))
        return Promise.all(promises).then(() => ret)
      })
    })
  }
}

module.exports = Directory
