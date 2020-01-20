'use strict'

const fs = require('fs')
const path = require('path')

const child_proc = require('child_process')
const config = require('config')
const ora = require('ora')
const get_colors = require('get-image-colors')
const chalk = require('chalk')

const lyrics = require('./lyrics')
const checkSong = require(`./platforms/${require('os').platform()}`)

let last = {}
let delay = config.get('delay')
let logging = config.get('log.enabled')
let logFile = fs.createWriteStream('out/log.txt', {flags: 'a'})

function renderLyrics(now, album_colours) {
	for (let i = album_colours.length; i < 4; i++)
		album_colours.push([255, 255, 255])

	const clearScreen = numLines =>
		console.log('\n'.repeat(Math.max(process.stdout.rows - numLines - 4, 0)))

	function printLyrics(err, data) {
		if (err) {
			console.log(err, ':(') // TODO: emoji
			return clearScreen(2)
		}
		
		const lines = data.split('\n')
		for (let line of lines) {
			if (line.match(/^\[.*?\]$/g))
				console.log(chalk.blue(line))
			else {
				let found = line.match(/^(.*?)(\(.+?\))?$/)
				console.log(found[1] + (found[2] ? chalk.grey(found[2]) : ''))
			}
		}

		let wideys = lines.filter(v => v.length > process.stdout.columns).length
		clearScreen(lines.length + 1 + wideys)
	}

	function writeLog(err) {
		if (!logging)
			return

		logFile.write(err ? 'Error: ' : 'Good:  ')
		logFile.write(`${now.artist} - ${now.song}\n`)
	}

	const bg = (length, index) => chalk.bgRgb(...album_colours[index])(' '.repeat(length))

	const title = ` ${now.artist} - ${now.song} `
	const pad = (80 - title.length) / 2
	lyrics(now, (err, data) => {
		console.log(bg(20, 3) + bg(40, 0) + bg(20, 1))
		console.log(bg(Math.floor(pad), 3) + title + bg(Math.ceil(pad), 1))
		console.log(bg(20, 3) + bg(40, 2) + bg(20, 1))
		printLyrics(err, data)
		writeLog(err)
	})
}

function songFromWindowTitle(wt) {
	const info = wt.match(/^(.*?) - (.*?)(?: - .*)?$/)
	return { artist: info[1], song: info[2] }
}

function captureAlbumArt(cb) {

	function remove_similars(arr, compare) {
		let uniques = []
		for (let i = 0; i < arr.length; i++) {
			for (let j = 0; j < uniques.length; j++) {
				if (!compare(arr[i], uniques[j]))
					uniques.push(arr[i])
			}
		}
		return uniques
	}

	const close_colours = (c1, c2) =>
		c1 != c2 &&
		Math.abs(c1[0] - c2[0]) < 16 &&
		Math.abs(c1[1] - c2[1]) < 16 &&
		Math.abs(c1[2] - c2[2]) < 16

	child_proc.exec('python screengrab.py', err => {
		if (err)
			throw err

		get_colors(path.join(__dirname, 'out/screengrab.png'), {count: 10})
		.then(rgbs => {
			let album_colours = rgbs
				.map(x => x._rgb.slice(0, 3))
				.filter(x =>
					Math.abs(x[0] - x[1]) > 16 ||
					Math.abs(x[1] - x[2]) > 16 ||
					Math.abs(x[2] - x[0]) > 16
				)

			cb(remove_similars(album_colours, close_colours))
		})
	})
}

const shouldLoad = now =>
	now.artist && now.song && JSON.stringify(last) !== JSON.stringify(now)

// MAIN
if (!checkSong)
	return console.log('Operating System Not Supported.')

const spinner = ora('Loading').start()

setInterval(checkSong, delay, (err, wt) => {
	if (err)
		return spinner.text = 'Cannot find Spotify process'

	if (['Spotify Premium', 'Spotify Free', 'Spotify'].includes(wt))
		return spinner.text = 'Nothing playing on Spotify'

	spinner.stop()
	const now = songFromWindowTitle(wt)

	if (shouldLoad(now)) {
		captureAlbumArt((album_colours) => {
			console.log(album_colours)
			renderLyrics(now, album_colours)
			last = now
		})
	}
})
