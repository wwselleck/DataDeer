let path = require('path')
const googledrive = require('@wwselleck/raft-plugin-googledrive')

module.exports = {
  dataSources: [
    googledrive({
      id: 'data',
      authConfig: {
        type: 'service',
        path: path.resolve(__dirname, 'creds', 'raft_creds.json')
      },
      basedir: 'ExampleSite',
      tables: ['data'],
      images: ['winnie.jpg']
    })
  ]
}
