'use strict'

let child_proc = require('child_process')

module.exports = function(cb) {
	const cmd = 'powershell -command "gps Spotify | where {$_.mainWindowTitle} | fl MainWindowTitle"'
	child_proc.exec(cmd, (err, stdout) => {
		if (err)
			return cb(err)

		let wt = stdout.trim().match(/^MainWindowTitle : (.*)$/)[1]
		cb(null, wt)
	})
}