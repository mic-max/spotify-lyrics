#!/usr/bin/env node
'use strict'

require('colour')
const ora = require('ora')
const fetch = require('node-fetch')
const flatCache = require('flat-cache')
const playing = require('spotify-playing')

// Globals
let lastMusic = {}
const spinner = ora('Loading').start()
const cache = flatCache.load('m')

function lyrics(music, done) {
	// Check Cache
	const cachedLyrics = cache.getKey(JSON.stringify(music))
	if (cachedLyrics)
		return done(null, cachedLyrics)

	// Make API Request
	fetch(`https://mic-max.api.stdlib.com/lyrics/?artist=${music.artist}&song=${music.song}`)
		.then(res => res.json())
		.then(data => {
			if (data.lyrics === null)
				return done('Lyrics Not Available')
			return done(null, data.lyrics)
		})
		.catch(err => done('Endpoint Not Available'))
}

function clearScreen(numLines) {
	console.log('\n'.repeat(Math.max(process.stdout.rows - numLines - 4, 0)))
}

function renderLyrics(music) {
	console.log(`${music.artist.magenta} - ${music.song.cyan}`)
	console.log('-'.repeat(80).rainbow)

	spinner.start('Fetching')
	lyrics(music, (err, lines) => {
		if (err)
			return spinner.fail(err)
		
		spinner.stop()
		for (let line of lines) {
			if (line.match(/^\[.*?\]$/g))
				console.log(line.blue)
			else
				console.log(line.white)
		}

		let wideys = lines.filter(v => v.length > process.stdout.columns).length
		clearScreen(lines.length + wideys)

		// Save to Cache
		cache.setKey(JSON.stringify(music), lines)
	})
}

// Windows SIGINT Workaround: https://stackoverflow.com/a/14861513
if (process.platform === 'win32') {
	const rl = require('readline').createInterface({
		input: process.stdin,
		output: process.stdout
	})

	rl.on('SIGINT', () => process.emit('SIGINT'))
}

process.on('SIGINT', () => {
	spinner.start('Saving')
	cache.save(true)
	spinner.succeed()
	process.exit(0)
})

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
	setTimeout(main, 2000)
}()
