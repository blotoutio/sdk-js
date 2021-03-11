'use strict'

if (process.env.NODE_ENV === 'production') {
  module.exports = require('./cjs/index.production.min.js')
} else {
  module.exports = require('./cjs/index.development.js')
}
