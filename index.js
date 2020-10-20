'use strict'

require('colour')
const ora = require('ora')
const fetch = require('node-fetch')
const playing = require('spotify-playing')

let lastMusic = {}
const spinner = ora('Loading').start()

function lyrics(music, done) {
	fetch(`https://mic-max.api.stdlib.com/lyrics/?artist=${music.artist}&song=${music.song}`)
		.then(res => res.json())
		.then(data => {
			if (data.lyrics === null)
				return done('Lyrics Not Available')
			return done(null, data.lyrics)
		})
		.catch(err => {
			return done('Endpoint Not Available')
		})
}

function clearScreen(numLines) {
	console.log('\n'.repeat(Math.max(process.stdout.rows - numLines - 4, 0)))
}

function renderLyrics(music) {
	console.log(`${music.artist.magenta} - ${music.song.cyan}`)
	console.log('-'.repeat(80).rainbow)

	spinner.start('Fetching')
	lyrics(music, (err, lines) => {
		spinner.stop()
		if (err)
			return console.log(err)
		
		for (let line of lines) {
			if (line.match(/^\[.*?\]$/g))
				console.log(line.blue)
			else
				console.log(line.white)
		}

		let wideys = lines.filter(v => v.length > process.stdout.columns).length
		clearScreen(lines.length + wideys)
	})
}

!function main() {
	playing((err, music) => {
		if (err)
			return spinner.start(err)
		spinner.stop()
		
		if (music.artist && music.song && JSON.stringify(lastMusic) !== JSON.stringify(music)) {
			renderLyrics(music)
			lastMusic = music
		}
	})
	setTimeout(main, 1500)
}()
