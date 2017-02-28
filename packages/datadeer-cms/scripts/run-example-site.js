const EXAMPLE_SITE_DIR = '../../../example_site'
const config = require(`${EXAMPLE_SITE_DIR}/drivecms.config.js`)
const DriveCMSServer = require('../../drivecms-server')

const server = new DriveCMSServer(config)
server.start()
