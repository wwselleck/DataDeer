const Spreadsheet = require('../lib/Spreadsheet')
let SheetsAPI = require('./SheetsAPI')
let api = require('googleapis').drive('v3')
let log = require('../lib/logger.js')

const MIME_TYPES = {
  SHEET: 'application/vnd.google-apps.spreadsheet',
  FOLDER: 'application/vnd.google-apps.folder',
  FILE: 'application/vnd.google-apps.file'
}

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

function _getSpreadsheetsFromFiles (files, { auth }) {
  log.debug({files}, 'Attemping to get spreadsheets from files')
  return Promise.all(files.map(f => {
    return SheetsAPI.getSpreadsheet(f.id, { auth }).then(spreadsheet => {
      return {
        name: f.name,
        spreadsheet
      }
    })
  }))
}

function loadSpreadsheetsInDirectory (dirId, spreadsheetNames, { auth }) {
  const { SHEET } = MIME_TYPES
  return searchFiles(
    `'${dirId}' in parents and mimeType = '${SHEET}'`,
    { auth }
  ).then(files => {
    log.debug({files}, 'Spreadsheet files fetched')
    return _getSpreadsheetsFromFiles(
      files.filter(f => spreadsheetNames.includes(f.name)),
      { auth }
    )
  }).then(spreadsheets => {
    log.debug({number: spreadsheets.length}, 'Spreadsheets fetched')
    const ret = {}
    spreadsheets.forEach(s => {
      ret[s.name] = Spreadsheet.extractData(s.spreadsheet)
    })
    return ret
  })
}

function loadImagesInDirectory (dirId, images, { auth }) {
  const ret = {}
  return Promise.all(images.map(imageName => {
    return loadImageInDirectory(dirId, imageName, { auth }).then(image => {
      ret[imageName] = image
    })
  })).then(() => ret)
}

function loadImageInDirectory (dirId, imageName, { auth }) {
  let q = `name = '${imageName}' and '${dirId}' in parents`
  return searchFiles(q, {auth}).then(file => {
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
        resolve(image.webContentLink)
      })
    })
  })
}

/*
function loadDirData (parentid, {auth, spreadsheets = [], images = []}) {
  log.info({parentid, spreadsheets, images}, 'Reading data from data tables')
  let ret = {}
  let promises = []
  spreadsheets.forEach(t => {
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
*/

module.exports = {
  searchFiles,
  loadImagesInDirectory,
  loadSpreadsheetsInDirectory,
  MIME_TYPES
}
