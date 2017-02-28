let DriveAPI = require('./api/DriveAPI')
let { authenticate: gAuthenticate } = require('./auth')
let log = require('./lib/logger.js')

function _resolveAuthOpts (config) {
  let scopes = [
    'https://www.googleapis.com/auth/drive',
    'https://www.googleapis.com/auth/spreadsheets'
  ]

  return Object.assign({}, config, { scopes })
}

function authenticate (authConfig) {
  const authOpts = _resolveAuthOpts(authConfig)
  log.info('Attempting to authenticate...')
  return gAuthenticate(authOpts)
}

function _confirmAuth (auth, authConfig) {
  if (auth) {
    return Promise.resolve(auth)
  }
  if (!authConfig) {
    return Promise.reject(new Error('Invalid auth config'))
  }
  return authenticate(authConfig)
}

function _confirmBaseDirId (basedirId, basedirName, { auth }) {
  if (basedirId) {
    return basedirId
  }

  log.debug({basedirName}, 'Attemping to resolve basedirId')
  if (!auth) {
    return Promise.reject(new Error('Cannot resolve base directory without authentication'))
  }

  if (!basedirName) {
    return Promise.reject(new Error('Invalid base directory configuration'))
  }

  const q = `name='${basedirName}'`
  return DriveAPI.searchFiles(q, {
    auth
  }).then(files => {
    if (files.length < 1) {
      throw new Error(`Base directory ${basedirName} could not be found`)
    }
    log.debug(files)
    return files[0].id
  })
}

function fetch (opts) {
  log.debug({opts}, 'Fetching...')
  const {
    auth,
    basedirId,
    tables,
    images
  } = opts

  return DriveAPI.loadDirData(basedirId, {
    auth,
    tables,
    images
  })
}

function create (opts = {}) {
  log.debug({opts}, `Creating googledrive instance`)
  const {
    authConfig,
    basedir,
    tables,
    images
  } = opts

  let auth = null
  let basedirId = null

  return () => {
    return _confirmAuth(auth, authConfig)
      .then(_auth => {
        auth = _auth
        return _confirmBaseDirId(basedirId, basedir, { auth })
      })
      .then(_basedirId => {
        basedirId = _basedirId
        return fetch({
          auth,
          basedirId,
          tables,
          images
        })
      })
  }
}

module.exports = create
