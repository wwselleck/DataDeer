let path = require('path')

module.exports = {
  plugins: [
    {
      plugin: 'googledrive',
      id: 'data',
      authConfig: {
        type: 'service',
        path: path.resolve(__dirname, 'creds', 'drivecms_creds.json')
      },
      basedir: 'ExampleSite',
      tables: ['data'],
      images: ['winnie.jpg']
    }
  ]
}
