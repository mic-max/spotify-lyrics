'use strict'

let lyrics = require('./lyrics')

// move spotify current song into a seperate module
// will have a way of determining OS
// then will run the coresponding script to get the song name and artist
// plus any other information easily available
// if i made it into a .exe: the system type would already be known
// so would only need to package a single spotify script
// but would need a different exe for windows, mac and linux

// seperate log file into a module
// allow it to be optional, by the user (changing the config file)
// when the log is long enough* send it to a server, then delete the user's version
// have a way to sift through which songs worked and didn't

// have different lyric website support
// azlyrics, genius, musixmatch, etc.
// the program should try all of these in sucession until proper lyrics are found

// add colours to the lyrics printed to the console
// different for title, [chorus x2]
// put the (ay, ay, ay) - background vocals in a duller font colour

// create a json config file
// can have information about the user's colour preference
// order of lyrics websites to query
// operating system
// log file enabled
// delay between checking if the song's changed (increase if using too many resources)

// have the program packaged into a .exe
// users won't have to install nodejs or create a script to run it
// would have to be platform specific...

// have a better console interface
// always print the song title at the top of the screen
// get size of terminal with: process.stdout.columns, process.stdout.rows
// https://nodejs.org/api/tty.html and an event for console resize
// clear the screen with the right amount of lines
// only have the chorus printed once
// have some sort of scrolling for the lyrics along with how far into the song they are?
// hard because i don't think we can know if the user skips along in the song, or listens to it twice in a row
// pausing does work, will need to know length of song in seconds and implement an algorithm for karaoke rendering

let fs = require('fs')
let colour = require('colour')
let child_proc = require('child_process')

let logFile = fs.createWriteStream('log.txt', {flags: 'a'})

const cmd = 'powershell -command "Get-Process Spotify | where {$_.mainWindowTItle} | Format-List MainWindowTitle"'

function handlePowershellCommand(str) {
	let wt = str.replace(/\n|\r|MainWindowTitle : | \(.*?\)/g, '')
	// remove The from the start of artist names
	let splits = wt.split(' - ')

	return {
		artist: splits[0],
		song:   splits[1] // until the next dash? exclude features
	}
}

// make this function non-recursive
function main(last) {
	setTimeout(() => {
		child_proc.exec(cmd, function(err, stdout, stderr) {
			if(err)
				throw err

			let now = handlePowershellCommand(stdout)
			// console.log('last', last)
			// console.log('now', now)
			if(now.artist && now.song && (last.artist !== now.artist || last.song !== now.song)) {
				for(let i = 0; i < 10; i++)
					console.log('\n\n\n\n\n\n\n\n\n\n')
				console.log('Playing:', now.artist, '-', now.song.green)
				console.log('---------------------------------------------------------')
				// have multiple lyrics functions to get and parse lyrics
				// from different websites as a fallback
				lyrics(now.artist, now.song, (err, data) => {
					if(err) {
						console.log('Lyrics Unavailable :(')
						logFile.write('Error: ')
					} else {
						console.log(data) // improve the way lyrics are printed
						logFile.write('Good:  ')
					}
					logFile.write(now.artist + ' - ' + now.song + '\n')
				})
			}
			if(now.artist && now.song)
				main(now)
			else
				main(last)
		})
	}, 2000)
}

main('')
