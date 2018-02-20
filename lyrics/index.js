'use strict'

const service = './services/'
const lyrics = {
  'azlyrics': require(service + 'azlyrics'),
  'genius': require(service + 'genius'),
  'musixmatch': require(service + 'musixmatch')
}

module.exports = lyrics['azlyrics']
