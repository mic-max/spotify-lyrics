'use strict'

let cheerio	= require('cheerio')
let request	= require('request')

function createUrl(artist, song) {
  const whole = artist.replace(/^the /ig, '') + '/' + song
  const lyricsLink = whole.toLowerCase().replace(/[^a-z0-9 /]/g, '').replace(/ /g, '-').replace(/-{2,}/g, '-')
  return `https://www.musixmatch.com/lyrics/${lyricsLink}`
}

function musixmatch(music, done) {
  // console.log('musixmatch check')

  let link = createUrl(music.artist, music.song)
  console.log('link:', link)

	// TODO: check if link is a valid url before doing the request
	// for example more than one '/'  (might change the seperating character)
	// console.log('lyric request to', link)
	request(link, (err, res, body) => {
		if(!err && res.statusCode === 200) {
			let $ = cheerio.load(body)
			const rawData = $('p.mxm-lyrics__content').text()
			done(null, rawData)
		} else {
			done('Not Available on MusixMatch')
		}
	})
}

module.exports = musixmatch
