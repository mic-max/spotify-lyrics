'use strict'

const os = require('os')

const platform = './platforms/'
const scripts = {
  'win32': require(platform + 'windows'),
  'linux': require(platform + 'linux'),
  'darwin': require(platform + 'mac')
}

// console.log(`[${os.platform()}]`)
module.exports = scripts[os.platform()]
