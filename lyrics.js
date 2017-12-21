'use strict'

let cheerio	= require('cheerio')
  , request	= require('request')

function lyrics(artist, song, done) {

	// u2 -> u2band
	// two-part songs with a slace to seperate them:
		// extraordinary girl/letterbomb
		// face to face / short circuit
	// artist names like USS (Ubiquity Synergy Seeker)
		// use the full name for az lyrics
	const whole = artist.replace(/^the /ig, '') + '/' + song
	const lyricsLink = whole.toLowerCase().replace(/[^a-z0-9/]/g, '')
	const link = `https://www.azlyrics.com/lyrics/${lyricsLink}.html`

	// TODO: check if link is a valid url before doing the request
	// for example more than one '/'  (might change the seperating character)
	// console.log('lyric request to', link)
	request(link, (err, res, body) => {
		if(!err && res.statusCode === 200) {
			let $ = cheerio.load(body)
			const rawData = $('div').eq(21).text().trim()
			done(null, rawData)
		} else {
			done('Not Available on AZLyrics')
		}
	})
}

module.exports = lyrics