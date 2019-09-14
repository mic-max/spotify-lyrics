'use strict'

const child_proc = require('child_process')

function windows(cb) {
	const cmd = 'powershell -command "gps Spotify | where {$_.mainWindowTitle} | fl MainWindowTitle"'
	child_proc.exec(cmd, (err, stdout) => {
		if (err)
			return cb(err)

		const wt = stdout.trim().match(/^MainWindowTitle : (.*)$/)

		if (wt)
			return cb(null, wt[1])
		return cb(true)
	})
}

module.exports = windows