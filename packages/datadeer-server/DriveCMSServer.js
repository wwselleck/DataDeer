let express = require('express')
let exphbs = require('express-handlebars')
let morgan = require('morgan')
let DriveCMSCore = require('drivecms-core')
let datapoll = require('./lib/DataPoll.js')
let log = require('./lib/logger.js')

class DriveCMSServer {
  constructor (config) {
    this.config = config
    this.core = new DriveCMSCore(config)
  }

  _startPolling () {
    const { dataInterval = 5000 } = this.config
    this.poll = datapoll.start(() => {
      return this.core.fetch()
    }, (data) => {
      this.setData(data)
    }, dataInterval)
  }

  _appSetup () {
    this.app = express()
    this.app.use(morgan('combined'))

    this.app.engine('html', exphbs({
      defaultLayout: false,
      extname: '.html'
    }))

    this.app.set('views', './public')
    this.app.set('view engine', 'html')

    this.app.use('/static', express.static('./public'))

    this.app.get('/*', (req, res) => {
      console.info(this.data)
      res.render(req.params['0'] || 'index', this.data)
    })
  }

  authenticate () {
    return this.core.authenticate()
  }

  setData (data) {
    log.info(data, 'Setting server data')
    this.data = data
  }

  start () {
    this._appSetup()
    const p = []
    if (!this.core.isAuthenticated()) {
      p.push(this.authenticate())
    }

    return Promise.all(p).then(() => {
      this._startPolling()

      return new Promise((resolve, reject) => {
        this.app.listen(3000, () => {
          log.info({port: 3000}, 'Listening!')
          resolve()
        })
      })
    })
  }
}

module.exports = DriveCMSServer
