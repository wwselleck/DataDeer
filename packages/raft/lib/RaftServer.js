let express = require('express')
let exphbs = require('express-handlebars')
let morgan = require('morgan')
let log = require('./logger')
const DataPoll = require('./DataPoll')

class RaftServer {
  constructor ({dataManager, dataInterval} = {}) {
    this.dataManager = dataManager
    this.app = this._createApp()
  }

  _createApp () {
    const app = express()
    app.use(morgan('combined'))

    app.engine('html', exphbs({
      defaultLayout: false,
      extname: '.html'
    }))

    app.set('views', './public')
    app.set('view engine', 'html')

    app.use('/static', express.static('./public'))

    app.get('/*', (req, res) => {
      console.info(this.data)
      res.render(req.params['0'] || 'index', this.data)
    })
    return app
  }

  /**
   * Start polling for data and update
   */
  _startPolling () {
    const dataInterval = this.dataInterval || 4000
    this.poll = DataPoll.start(this.dataManager, data => {
      this.setData(data)
    }, dataInterval)
  }

  setData (data) {
    log.info(data, 'Setting server data')
    this.data = data
  }

  setDataManager (dm) {
    this.dataManager = dm
  }

  start () {
    this._startPolling()

    return new Promise((resolve, reject) => {
      this.app.listen(3000, () => {
        log.info({port: 3000}, 'Listening on 3000!')
      })
    })
  }
}

module.exports = RaftServer
