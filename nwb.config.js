const baseConfig = require('../../scripts/nwb.config')

const config = baseConfig()
config.npm.umd.global = 'widgetbot'

module.exports = config
