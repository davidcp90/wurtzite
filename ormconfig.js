const nconf = require('nconf')
const path = require('path')

const environment = process.env.NODE_ENV || 'development'

nconf.argv().env().file({
 file: path.resolve(`config/envs/${environment}.json`)
})

module.exports = nconf.get('database')
