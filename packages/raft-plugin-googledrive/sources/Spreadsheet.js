const Source = require('./Source')
const SheetsAPI = require('../api/SheetsAPI')
const log = require('../lib/logger.js')

function _validKey (key) {
  return key && key !== ''
}

function _extractPropertyNames (data) {
  let [, ...propCells] = data.values
  return propCells.map(c => c.userEnteredValue.stringValue)
}

function _extractDataFromObjRow (row, propertyNames) {
  let ret = {}
  propertyNames.forEach((property, i) => {
    try {
      ret[property] = row[i].userEnteredValue.stringValue
    } catch (e) {
      log.error({err: e, property, cell: row[i]}, 'Error extracting data from property')
    }
  })
  return ret
}

function _extractDataFromSheet (sheet) {
  let ret = {}
  let data = sheet.data[0].rowData
  // First row is just property names
  // Remaining rows are actual data
  let [propertyNameRow, ...objRows] = data
  let propertyNames = _extractPropertyNames(propertyNameRow)
  log.debug({propertyNames}, 'Mapped row1 values to property names successfully')
  log.debug('Iterating over data rows in sheet')
  for (let row of objRows) {
    // First cell is key name, remaining cells are property values
    let [keyCell, ...valueCells] = row.values
    let key = keyCell.userEnteredValue.stringValue.trim()
    if (!_validKey(key)) {
      log.error({key}, 'Invalid key in row, not extracting data')
    } else {
      log.debug({key}, 'Extracting data from row')

      let extractedData = _extractDataFromObjRow(valueCells, propertyNames)
      ret[key] = extractedData

      log.debug({key, extractedData}, 'Successfully extracted data from row')
    }
  }
  return ret
}

function extractSpreadsheetData (spreadsheet) {
  let ret = {}
  log.debug('Iterating over sheets in spreadsheet')
  for (let sheet of spreadsheet.sheets) {
    let sheetKey = sheet.properties.title
    log.debug({sheetKey}, 'Extracting data from sheet')
    let extractedData = _extractDataFromSheet(sheet)
    if (ret[sheetKey]) {
      log.warn(sheetKey, 'Overwriting duplicate sheet name')
    }
    ret[sheetKey] = extractedData
    log.debug({sheetKey, extractedData}, 'Successfully extracted data from sheet')
  }
  log.info({data: ret, id: spreadsheet.spreadsheetId}, 'Extracted data from spreadsheet')
  return ret
}

class Spreadsheet extends Source {
  /**
   * @param {object} opts - options
   * @property {array} children - Children to fetch from
   * @property
   */
  data (opts) {
    opts = opts || this.config.default
    return this.prereq().then(() => {
      const { auth, id } = this.config
      log.debug('Confirmed, fetching data')
      return SheetsAPI.getSpreadsheet(id, {
        auth
      }).then(extractSpreadsheetData)
        .catch(err => {
          log.error({err})
        })
    }).catch(err => {
      log.error({err}, 'Error fetching data')
    })
  }
}

module.exports = Spreadsheet
