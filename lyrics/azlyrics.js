'use strict'

const cheerio = require('cheerio')
const request = require('request')

function createUrl(artist, song) {
	const whole = `${artist.replace(/^the /ig, '')}/${song.replace(/\//g, '')}`
	const lyricsLink = whole.toLowerCase()
		.replace(/\(.*?\)/g, '')
		.replace(/[^a-z0-9/]/g, '')
	return `https://www.azlyrics.com/lyrics/${lyricsLink}.html`
}

function azlyrics(music, done) {
	let link = createUrl(music.artist, music.song)

	request(link, (err, res, body) => {
		if (err || res.statusCode !== 200)
			return done('Not Available on AZLyrics')

		let $ = cheerio.load(body)
		const rawData = $('div').eq(19)
			.text()
			.trim()
		done(null, rawData)
	})
}

module.exports = azlyrics
