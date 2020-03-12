#!/usr/bin/env node
'use strict'

require('colour')
const ora = require('ora')
const lyrics = require('lyric-fetcher')
const playing = require('spotify-playing')

function renderLyrics(now) {
	// count lines > console.width
	const clearScreen = numLines =>
		console.log('\n'.repeat(Math.max(process.stdout.rows - numLines - 4, 0)))

	function printLyrics(err, data) {
		if (err)
			return console.error(err)
		
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

	console.log(`${now.artist.magenta} - ${now.song.cyan}`)
	console.log('-'.repeat(80).rainbow)
	lyrics(now, (err, data) => {
		printLyrics(err, data)
	})
}

// MAIN
if (!playing) {
	console.error('Operating System Not Supported.')
	process.exit(1)
}

let last = {}
const spinner = ora('Loading').start()

!function main() {
	playing((err, now) => {
		if (err)
			return spinner.text = 'Cannot find Spotify process'

		if (!now)
			return spinner.text = 'Nothing playing on Spotify'

		spinner.stop()

		if (now.artist && now.song && JSON.stringify(last) !== JSON.stringify(now)) {
			// TODO: show loading spinner while fetching lyrics
			renderLyrics(now)
			last = now
		}
		setTimeout(main, 1500)
	})
}()
