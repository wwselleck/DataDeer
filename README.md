# DataDeer
[![js-standard-style](https://cdn.rawgit.com/feross/standard/master/badge.svg)](https://github.com/feross/standard)

![deer](https://s-media-cache-ak0.pinimg.com/736x/3e/75/62/3e7562e3ef592b24e741ae61b5442cdc.jpg)

DataDeer is a plugin-based module for fetching data from various sources.

## Packages
DataDeer is a [monorepo](https://github.com/babel/babel/blob/master/doc/design/monorepo.md). Why? I wanted to try it out and this project seemed like a decent fit.

| Package | Description |
|--------|---------------|
| [`datadeer-cli`](/packages/datadeer-cli) | Somethign that will change |
| [`datadeer-cms`](/packages/datadeer-cms) | Run a simple web server that can be templated to use DataDeer data |
| [`datadeer-core`](/packages/datadeer-core) | Core DataDeer package that accepts configuration and plugins and exposes function(s) to retrieve data |
| [`datadeer-logger`](/packages/datadeer-logger) | Logger for all other packages to import and use for logging |

### Built-In Plugins
| Package | Description |
|--------|---------------|
| [`datadeer-plugin-googledrive`](/packages/datadeer-plugin-googledrive) | Fetch data from a Google Drive folder (spreadsheets, image urls, etc) |
| [`datadeer-logger`](/packages/datadeer-logger) | Logger for all other packages to import and use for logging |

### Third Party Plugins
> This is so trivial no one wants to make plugins for your dumb data fetcher thing

Yeah I know but maybe the idea of having it listed here will motivate someone to make one.

## Getting Started
