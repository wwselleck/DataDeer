let api = require('googleapis').sheets('v4')
let log = require('../lib/logger.js')


function getSpreadsheet (id, {auth}) {
  log.info({id}, 'Getting spreadsheet')
  return new Promise((resolve, reject) => {
    api.spreadsheets.get({
      auth,
      spreadsheetId: id,
      includeGridData: true
    }, (err, spreadsheet) => {
      if (err) {
        return reject(err)
      }
      resolve(spreadsheet)
    })
  })
}

function loadSpreadsheetData (id, {auth}) {
  log.info({id}, 'Attempting to fetch spreadsheet')
  return getSpreadsheet(id, {auth}).then(spreadsheet => {
    return _extractSpreadsheetData(spreadsheet)
  })
}

module.exports = {
  getSpreadsheet,
  loadSpreadsheetData
}
