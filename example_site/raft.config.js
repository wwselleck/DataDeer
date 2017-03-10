let path = require('path')
const googledrive = require('@wwselleck/raft-plugin-googledrive')

module.exports = {
  dataSources: {
    'gdrive': {
      source: googledrive({
        authConfig: {
          type: 'service',
          path: path.resolve(__dirname, 'creds', 'raft_creds.json')
        },
        baseDirName: 'ExampleSite'
      }),
      options: {
        default: {
          action: 'extractData',
          options: {
            spreadsheets: ['data'],
            images: ['winnie.jpg']
          }
        }
      }
    },


    'gdrive2': {
      source: googledrive({
        authConfig: {
          type: 'service',
          path: path.resolve(__dirname, 'creds', 'raft_creds.json')
        },
        baseDirName: 'ExampleSite'
      }),
      options: {
        default: {
          action: 'extractData',
          options: {
            spreadsheets: ['data2'],
            images: ['winnie.jpg']
          }
        }
      }
    }
  }
}
