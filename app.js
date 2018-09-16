'use strict'

let fs = require('fs')
let colour = require('colour')
let config = require('config')

let lyrics = require('./lyrics')
let checkSong = require('./spotify-info')

// GLOBAL VARIABLES
let last = {artist: '', song: ''}
let logFile = fs.createWriteStream('log.txt', {flags: 'a'})
let delay = config.get('delay')
let logging = config.get('log.enabled')

// INIT
colour.setTheme(config.get('colour'))

function handler(err, now) {
  if(err) {
    console.log('Cannot find Spotify process.')
    // throw err
  } else if(shouldLoad(now, last)) {
    renderLyrics(now)
    last = now
  }
}

function renderLyrics(now) {
  function clearScreen(numLines) {
    const rows = process.stdout.rows
    try {
      console.log('\n'.repeat(rows - numLines - 4))
    } catch(e) {} // or -- if(rows - numLines - 4 > 0 ... console.log('\n'.repeat))
  }

  function printLyrics(err, data) {
    if(err) {
      console.log('Lyrics Unavailable :(')
    } else {
      const lines = data.split('\n')
      // if a line length is longer than the terminal width it may wrap to the next line.
        // meaning it would print an extra newline for each of these
      // colour the lines if they match certain criteria. eg. [hook], [intro] [outro] [chorus (x2)] etc.
      for(let line of lines) {
        console.log(line.white) // improve the way lyrics are printed
      }
      clearScreen(lines.length)
    }
  }

  function writeLog(err) {
    logFile.write(err ? 'Error: ' : 'Good:  ')
    logFile.write(`${now.artist} - ${now.song}\n`) // TODO make a toString for song objects
    // write more info, like when user closes spotify, timestamps, etc. in a json format
  }

  function lyricsHandler(err, data) {
    printLyrics(err, data)
    if(logging)
      writeLog(err)
  }

  // START RENDER
  console.log(`${now.artist.red} - ${now.song.cyan}`) // centre this text?
  console.log('---------------------------------------------------------'.rainbow)
  lyrics(now, lyricsHandler)
}

function shouldLoad(now, last) {
  return now.artist && now.song && (last.artist !== now.artist || last.song !== now.song)
}

// MAIN
if(checkSong != null) {
  setInterval(checkSong, delay, handler)
} else {
  console.log('Operating System Not Supported.')
}
