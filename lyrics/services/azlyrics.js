'use strict'

let cheerio	= require('cheerio')
let request	= require('request')

// u2 -> u2band
// two-part songs with a slace to seperate them:
// extraordinary girl/letterbomb
// face to face / short circuit
// thursday/froze over - "interlude" => thursdayfrozeoverinterlude
// artist names like USS (Ubiquity Synergy Seeker)
// use the full name for az lyrics
// or do a google / azlyrics search for the song
// then follow that link...
function createUrl(artist, song) {
  const whole = artist.replace(/^the /ig, '') + '/' + song
  const lyricsLink = whole.toLowerCase().replace(/[^a-z0-9/]/g, '')
  return `https://www.azlyrics.com/lyrics/${lyricsLink}.html`
}

// TODO make a function that determines if the data is correct
// obviously we're already checking HTTP 200 status, but if the service doesn't follow that protocol :|

function lyrics(artist, song, done) {

  let link = createUrl(artist, song)

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
