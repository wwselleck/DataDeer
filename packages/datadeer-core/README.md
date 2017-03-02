## datadeer-core

>This is the main package for DataDeer.

### Installation
`npm install datadeer` or `npm install datadeer-core`

### Usage

#### DataDeer.create(config)
Create a new DataDeer instance
```javascript
const DataDeer = require('datadeer')
const datadeerGoogleDrive = require('datadeer-plugin-googledrive')

const fetcher = DataDeer.create({
  sources: [
    {
      id: 'drive'
      plugin: dataDeerGoogleDrive({some configuration}),
    }
  ]
})
```

#### fetcher.use(source)
Add a new source to the DataDeer instance
```javascript
fetcher.use({
    id: 'drive2',
    plugin: dataDeerGoogleDrive({some other configuration})
})
```

#### fetcher.fetch([id], [{override Configuration}])
Fetch data. If no id is proided, all sources will be fetched from with the default configuration.
```javascript
fetcher.fetch('drive', { options })
fetcher.fetch('drive2', { options })
fetcher.fetch()
```
