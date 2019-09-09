'use strict'

const child_proc = require('child_process')

/* eslint quotes: "off"*/
const cmd1 = `wmctrl -lp | awk '{printf "%d,%s\n", $3, substr($0, index($0,$5))}'`

function getAppWindowsInfo(str) {
	const xwins = str.trim().split('\n')
	let wins = []
	for (let win of xwins) {
		const m = win.match(/^(0-9+),(.*)$/)
		wins.push({
			pid: m[1],
			window_title: m[2]
		})
	}
	return wins
}

function isPIDSpotify(pid) {
	const cmd = `ps ${pid} | grep spotify`
	child_proc.exec(cmd, err => {
		console.log(err)
		return err === 0
	})
}

function linux(cb) {
	child_proc.exec(cmd1, (err, stdout) => {
		if (err)
			return cb(err)

		let title = ''
		let wins = getAppWindowsInfo(stdout)
		for (let win of wins) {
			if (isPIDSpotify(win.pid))
				title = win.window_title
				break
		}

		if (title === '')
			return cb(true)
		return cb(null, title)
	})
}

module.exports = linux