'use strict'

const cheerio = require('cheerio')
const fetch = require('node-fetch');

function createUrl(artist, song) {
	const whole = `${artist.replace(/^the /ig, '')}/${song}`
	const lyricsLink = whole.toLowerCase()
		.replace(/[^a-z0-9 /]/g, '')
		.replace(/ /g, '-')
		.replace(/-{2,}/g, '-')
	return `https://www.musixmatch.com/lyrics/${lyricsLink}`
}

function musixmatch(music, done) {
	let link = createUrl(music.artist, music.song)

	fetch(link)
		.then(res => res.text())
		.then(body => {
			let $ = cheerio.load(body)
			const rawData = $('p.mxm-lyrics__content').text().trim()
			done(null, rawData)
		})
		.catch(err => {
			return done('Not Available on MusixMatch')
		})
}

module.exports = musixmatch
