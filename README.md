# Raft
[![js-standard-style](https://cdn.rawgit.com/feross/standard/master/badge.svg)](https://github.com/feross/standard)

> A group of otters is called a _raft_. Actually there are at least three other words that are more appropriate to use to refer to a group of otters, but they didn't sound as cool for a project name.
<img src="http://main.dailyotter.org/wp-content/uploads/2012/09/tumblr_ll4zsfZYI31qzs75go1_1280.jpg" width="300">

Raft is a plugin-based Javascript module for serving a simple, data driven website using configurable data sources such as a Google Spreadsheet.

## Packages
Raft is a [monorepo](https://github.com/babel/babel/blob/master/doc/design/monorepo.md). Why? I wanted to try it out and it seemed like a decent fit for this project

| Package | Description |
|--------|---------------|
| [`raft-cli`](/packages/raft-cli) | Somethign that will change |
| [`raft-cms`](/packages/raft-cms) | Main something that'll change |
| [`raft-datamanager`](/packages/raft-datamanager) | Core DataDeer package that accepts configuration and plugins and exposes function(s) to retrieve data |
| [`raft-logger`](/packages/raft-logger) | Logger for all other packages to import and use for logging |

### Built-In Plugins
| Package | Description |
|--------|---------------|
| [`raft-plugin-googledrive`](/packages/raft-plugin-googledrive) | Fetch data from a Google Drive folder (spreadsheets, image urls, etc) |
| [`datadeer-logger`](/packages/raft-logger) | Logger for all other packages to import and use for logging |

### Third Party Plugins
> This is so trivial no one wants to make plugins for your dumb data fetcher thing

Yeah I know but maybe the idea of having it listed here will motivate someone to make one.

## Getting Started
