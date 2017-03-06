# datadeer-core

>This is the main package for DataDeer.

## Installation
`npm install @wwselleck/raft-datamanager

## Usage

### DataDeer.create(config)
Create a new DataDeer instance
```javascript
const RaftDataManager = require('raft-datamanager')
const googledrive = require('datadeer-plugin-googledrive')

const dataManager = RaftDataManager.create({
  sources: [
    {
      id: 'drive'
      plugin: googledrive({some configuration}),
    }
  ]
})
```

### dataManager.use(source)
Add a new source to the DataDeer instance
```javascript
dataManager.use({
    id: 'drive2',
    plugin: googledrive({some other configuration})
})
```

### dataManager.fetch([id], [{override Configuration}])
Fetch data. If no id is proided, all sources will be fetched from with the default configuration.
```javascript
dataManager.fetch('drive', { options }) // Data from drive
dataManager.fetch('drive2', { options }) // Data from drive2
dataManager.fetch() // Data from all sources
```
