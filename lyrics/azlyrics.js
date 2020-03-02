'use strict'

const cheerio = require('cheerio')
const fetch = require('node-fetch');

function createUrl(artist, song) {
	const whole = `${artist.replace(/^the /ig, '')}/${song.replace(/\//g, '')}`
	const lyricsLink = whole.toLowerCase()
		.replace(/\(.*?\)/g, '')
		.replace(/[^a-z0-9/]/g, '')
	return `https://www.azlyrics.com/lyrics/${lyricsLink}.html`
}

function azlyrics(music, done) {
	let link = createUrl(music.artist, music.song)

	fetch(link)
		.then(res => res.text())
		.then(body => {
			let $ = cheerio.load(body)
			// TODO: check that page isn't the welcome page
			// test with Daft Punk - Aerodynamic
			const rawData = $('div').eq(19).text().trim()
			done(null, rawData)
		})
		.catch(err => {
			return done('Not Available on AZLyrics')
		})
}

module.exports = azlyrics
