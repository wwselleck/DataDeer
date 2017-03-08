const Directory = require('./sources/Directory')
function create (options) {
  return (rpi) => {
    rpi.addDataSource(options.id, new Directory(options))
  }
}

module.exports = create
