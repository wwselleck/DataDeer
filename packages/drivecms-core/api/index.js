let google = require('googleapis')
let DriveAPI = require('./DriveAPI')
let SheetsAPI = require('./SheetsAPI')

let sheetsapi = new SheetsAPI(google.sheets('v4'))
let driveapi = new DriveAPI(google.drive('v3'), sheetsapi)

module.exports = driveapi
