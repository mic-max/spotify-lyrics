'use strict'

const cheerio = require('cheerio')
const request = require('request')

function createUrl(artist, song) {
	const whole = artist.replace(/^the /ig, '') + '/' + song
	const lyricsLink = whole.toLowerCase()
		.replace(/[^a-z0-9 /]/g, '')
		.replace(/ /g, '-')
		.replace(/-{2,}/g, '-')
	return `https://www.musixmatch.com/lyrics/${lyricsLink}`
}

function musixmatch(music, done) {
	let link = createUrl(music.artist, music.song)

	request(link, (err, res, body) => {
		if (err || res.statusCode !== 200)
			return done('Not Available on MusixMatch')
		let $ = cheerio.load(body)
		const rawData = $('p.mxm-lyrics__content').text()
		done(null, rawData)
	})
}

module.exports = musixmatch