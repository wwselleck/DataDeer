# raft-plugin-googldrive

This Raft plugin allows you to fetch data from a Google Drive folder.

## Usage
```javascript
const Raft = require('@wwselleck/raft')
const googledrive = require('@wwselleck/raft-plugin-googledrive')

const raft = Raft.create({
  datasources: [
    gdrive: {
        source: googledrive({
          authConfig: {
            type: 'service',
            path: path.resolve(__dirname, 'creds', 'gdrive_creds.json')
          },
          baseDirName: 'MyData'
        })
    }
  ]
})

raft.get('gdrive').do('getData', {
  spreadsheets: ['data', 'someOtherData']
  images: ['someonesPetRabbit.jpg']
})
```

### Configuration
#### authConfig
##### type
Either `service` or `oauth` (right now only service works)
##### path
Path to the Google credentials JSON file
#### baseDirName
Name of the directory you want to use

### Actions
#### getData
Get data from the directory
##### Configuration
`spreadsheets` - List of names of spreadsheets to get data from

`images` - List of images to get URLs for
