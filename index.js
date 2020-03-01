'use strict'

const fs = require('fs')

const colour = require('colour')
const config = require('config')
const ora = require('ora')
const playing = require('spotify-playing')

const lyrics = require('./lyrics')

let last = {}
let delay = config.get('delay')
let logging = config.get('log.enabled')
let logFile = fs.createWriteStream('out/log.txt', {flags: 'a'})

function renderLyrics(now) {
	// count lines > console.width
	const clearScreen = numLines =>
		console.log('\n'.repeat(Math.max(process.stdout.rows - numLines - 4, 0)))

	function printLyrics(err, data) {
		if (err)
			return console.log(err, ':(') // TODO: emoji
		
		const lines = data.split('\n')
		for (let line of lines) {
			if (line.match(/^\[.*?\]$/g))
				console.log(line.blue)
			else {
				let found = line.match(/^(.*?)(\(.+?\))?$/)
				console.log(found[1].white + (found[2] ? found[2].grey : ''))
			}
		}

		let wideys = lines.filter(v => v.length > process.stdout.columns).length
		clearScreen(lines.length + wideys)
	}

	function writeLog(err) {
		if (!logging)
			return

		logFile.write(err ? 'Error: ' : 'Good:  ')
		logFile.write(`${now.artist} - ${now.song}\n`)
	}

	console.log(`${now.artist.magenta} - ${now.song.cyan}`)
	console.log('-'.repeat(80).rainbow)
	lyrics(now, (err, data) => {
		printLyrics(err, data)
		writeLog(err)
	})
}

const shouldLoad = now =>
	now.artist && now.song && JSON.stringify(last) !== JSON.stringify(now)

// MAIN
if (!playing)
	return console.log('Operating System Not Supported.')

colour.setTheme(config.get('colour'))
const spinner = ora('Loading').start()

setInterval(playing, delay, (err, now) => {
	if (err)
		return spinner.text = 'Cannot find Spotify process'

	if (!now)
		return spinner.text = 'Nothing playing on Spotify'

	spinner.stop()

	if (shouldLoad(now)) {
		renderLyrics(now)
		last = now
	}
})
