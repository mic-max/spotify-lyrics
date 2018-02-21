'use strict'

const srv = './services/'
const lyrics = [
  require(srv + 'azlyrics'),
  require(srv + 'genius'),
  require(srv + 'musixmatch'),
  'LAST'
]

function loadLyrics(music, done) {

  for(let lyric of lyrics) {
    if(lyric === 'LAST')
      return done('Lyrics Unavailable :(')

    lyric(music, (err, data) => {
      if(!err) {
        done(null, data)
      }
    })
  }
}

// module.exports = loadLyrics
module.exports = lyrics[0]
