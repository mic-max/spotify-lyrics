'use strict'

const os = require('os')

const platform = './platforms/'
const scripts = {
  'win32': require(platform + 'windows'),
  'linux': require(platform + 'linux'),
  'darwin': require(platform + 'mac')
}

let os = os.platform()
console.log('Platform:', os)
scripts[os]()
