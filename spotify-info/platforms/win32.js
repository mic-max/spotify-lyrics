'use strict'

let child_proc = require('child_process')

const cmd = 'powershell -command "Get-Process Spotify | where {$_.mainWindowTItle} | Format-List MainWindowTitle"'

// returns a json object
// must have at least: artist, song
function handlePS(str) {
	let wt = str.replace(/\n|\r|MainWindowTitle : | \(.*?\)/g, '')
	// console.log('Window Title:', wt)

	// problematic if artist name has that string in it
	// song should contain everything after that dash
	// it is the responsibility of the lyrics script to do more checks regarding the actual song title
	// i.e. removing features, or remastered suffixes, etc.
	const seq = ' - '
	const split = wt.indexOf(seq)
	const result = {
		artist: wt.substring(0, split),
		song:   wt.substring(split + seq.length)
	}

	// console.log('Song Object:', result)
	return result
}

module.exports = function(cb) {
  child_proc.exec(cmd, function(err, stdout) {
    if(err)
      cb(err)

    let now = handlePS(stdout)
    cb(null, now)
  })
}
