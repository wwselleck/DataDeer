const GoogleDrive = require('./lib/GoogleDrive')
/**
 * @param {object} options
 * @property {string} options.id - Key for data store
 */
function create (options) {
  return new GoogleDrive(options)
}

module.exports = create
