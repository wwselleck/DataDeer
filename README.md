# Raft
[![js-standard-style](https://cdn.rawgit.com/feross/standard/master/badge.svg)](https://github.com/feross/standard)

> A group of otters is called a _raft_. Actually there are at least three other words that are more appropriate to use to refer to a group of otters, but they didn't sound as cool for a project name.

<img src="http://main.dailyotter.org/wp-content/uploads/2012/09/tumblr_ll4zsfZYI31qzs75go1_1280.jpg" width="300">

Raft is a plugin-based Javascript module for fetching data from configurable data sources.

## What?
The goal of this project is to provide a structured way of defining data sources, actions that can be performed on those data sources, and options/parameters that can or need to be provided for those actions. The hope is that this structure will allow for tooling (e.g. raft-cli) to be made that can work for any data sources that confine to this structure. Whether or not this is actually useful, or a problem that already has a solution I'm not aware of, I'm not sure. 

The movitation behind this project was a project I've been working on that requires getting some data from a Google Drive spreadsheet. After I wrote the pieces to get the data, I had to contiously make test scripts to see what the output would be with different parameters. That led me to want to make an interactive command line program that would prompt me for different paramaters and output the results, without having to make and edit a bunch of different junk files. Because I have no will power, I decided to generecize this to work for any "data fetcher" module that conforms to a certain structure, which is what Raft is. 

## Installation
All of the official raft packages are underneath the `@wwselleck` npm scope.

`npm install --save @wwelleck/raft`

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
/*
{
  gdrive: {
    spreadsheets: {
      data: ......
      someOtherData: ...
    },
    images: {
      someonesPetRabbit.jpg: .....
    }
  }
}
*/
```

## API
Documentation for each package can be seen in the `API.md` file in the package directory. For the Raft object (which you are probably most interested in), look [here](/packages/raft/API.md#libraftraft).

## CLI
[Documentation](/packages/raft-cli)


## Packages
Raft is a [monorepo](https://github.com/babel/babel/blob/master/doc/design/monorepo.md). Why? I wanted to try it out and it seemed like a decent fit for this project

| Package | Description |
|--------|---------------|
| [`raft`](/packages/raft) | Main package (no offense to the other packages) |
| [`raft-cli`](/packages/raft-cli) | Raft command line utility |
| [`raft-logger`](/packages/raft-logger) | Logger for all other packages to import and use for logging |

### Plugins
| Package | Description |
|--------|---------------|
| [`raft-plugin-googledrive`](/packages/raft-plugin-googledrive) | Fetch data from a Google Drive folder (spreadsheets, image urls, etc) |

### Third Party Plugins
> This is so trivial no one wants to make plugins for your dumb data fetcher thing

Yeah I know but maybe the idea of having it listed here will motivate someone to make one.

