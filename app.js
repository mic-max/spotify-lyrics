'use strict'

let fs = require('fs')
let colour = require('colour')

let logFile = fs.createWriteStream('log.txt', {flags: 'a'})

let lyrics = require('./lyrics')
let windows = require('./spotify-info')

let last = {artist: '', song: ''}

function handler(err, now) {
  if(err)
    throw err

  if(shouldLoad(now, last))
    renderLyrics(now)

    // recursion
  if(now.artist && now.song)
    last = now
}

function renderLyrics(now) {
  function clearScreen() {
    for(let i = 0; i < 10; i++)
      console.log('\n\n\n\n\n\n\n\n\n\n')
  }

  function printLyrics(data) {
    // TODO split on newlines
    // colour the lines if they match certain criteria. eg. [hook], [intro] [outro] [chorus (x2)] etc.
    console.log(data.magenta) // improve the way lyrics are printed
  }

  clearScreen()
  console.log(now.artist.red, '-', now.song.cyan)
  console.log('---------------------------------------------------------'.rainbow)

  lyrics(now.artist, now.song, (err, data) => {
    if(err) {
      console.log('Lyrics Unavailable :(')
      logFile.write('Error: ')
    } else {
      printLyrics(data)
      logFile.write('Good:  ')
    }
    logFile.write(now.artist + ' - ' + now.song + '\n') // TODO make a toString for song objects
  })
}

function shouldLoad(now, last) {
  return now.artist && now.song && (last.artist !== now.artist || last.song !== now.song)
}

// TODO detect operating system
// save the corresponding script that gets run every 2 seconds
setInterval(windows, 2000, handler)
