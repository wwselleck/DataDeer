let SheetsAPI = require('./SheetsAPI')
let api = require('googleapis').drive('v3')
let log = require('../lib/logger.js')

function searchFiles (q, {auth}) {
  log.info(`Searching for file with query ${q}`)
  return new Promise((resolve, reject) => {
    api.files.list({q, auth}, (err, res) => {
      if (err) {
        return reject(err)
      } else {
        return resolve(res.files)
      }
    })
  })
}

function loadImage (parentid, name, {auth}) {
  let q = `name = '${name}' and '${parentid}' in parents`
  return searchFiles(q, {auth}).then(file => {
    log.debug(file)
    return new Promise((resolve, reject) => {
      api.files.get({
        auth,
        fileId: file[0].id,
        fields: 'webContentLink'
      }, (err, image) => {
        if (err) {
          log.error(err)
          return reject(err)
        }
        log.debug(image)
        resolve(image.webContentLink)
      })
    })
  })
}

function loadSheetData (parentid, name, {auth}) {
  let q = `name = '${name}' and '${parentid}' in parents`
  return searchFiles(q, {auth}).then(res => {
    log.debug(res)
    return SheetsAPI.loadSpreadsheetData(res[0].id, {auth})
  })
}

function loadDirData (parentid, {auth, tables = [], images = []}) {
  log.info({parentid, tables}, 'Reading data from data tables')
  let ret = {}
  let promises = []
  tables.forEach(t => {
    promises.push(loadSheetData(parentid, t, {auth}).then(data => {
      if (ret[t]) {
        log.warn(t, 'Overwriting duplicate file name')
      }
      ret[t] = data
    }).catch(e => {
      log.error(e)
    }))
  })

  ret.images = {}
  images.forEach(i => {
    promises.push(loadImage(parentid, i, {auth}).then(url => {
      ret.images[i] = url
    }).catch(e => {
      log.error(e)
    }))
  })
  return Promise.all(promises).then(() => ret)
}

module.exports = {
  searchFiles,
  loadDirData
}
