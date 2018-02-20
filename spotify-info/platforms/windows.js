'use strict'

let child_proc = require('child_process')

const cmd = 'powershell -command "Get-Process Spotify | where {$_.mainWindowTItle} | Format-List MainWindowTitle"'

// returns a json object
// must have at least: artist, song
function handlePS(str) {
	let wt = str.replace(/\n|\r|MainWindowTitle : | \(.*?\)/g, '')
	// remove The from the start of artist names
	let splits = wt.split(' - ')

	return {
		artist: splits[0],
		song:   splits[1] // until the next dash? exclude features
	}
}

module.exports = function(cb) {
  child_proc.exec(cmd, function(err, stdout) {
    if(err)
      cb(err)

    let now = handlePS(stdout)
    cb(null, now)
  })
}
