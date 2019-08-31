'use strict'

let child_proc = require('child_process')


function handlePS(str) {
	const wt = str.trim().match(/^MainWindowTitle : (.*)$/)[1]
	// console.log('Window Title:', wt)

	// problematic if artist name has that string in it
	// song should contain everything after that dash
	// it is the responsibility of the lyrics script to do more checks regarding the actual song title
	// i.e. removing features, or remastered suffixes, etc.
	const seq = ' - '
	const split = wt.indexOf(seq)

	return {
		artist: wt.substring(0, split),
		song:   wt.substring(split + seq.length)
	}
}

module.exports = function(cb) {
	const cmd = 'powershell -command "gps Spotify | where {$_.mainWindowTitle} | fl MainWindowTitle"'
	child_proc.exec(cmd, (err, stdout) => {
		if (err)
			cb(err)

		let now = handlePS(stdout)
		cb(null, now)
	})
}
