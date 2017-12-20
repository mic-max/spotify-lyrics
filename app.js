'use strict'

let fs			= require('fs')
  , child_proc	= require('child_process')
  , lyrics		= require('./lyrics')

let logFile = fs.createWriteStream('log.txt', {flags: 'a'})
let logS

const cmd = 'powershell -command "Get-Process Spotify | where {$_.mainWindowTItle} | Format-List MainWindowTitle"'

function handlePowershellCommand(str) {
	let wt = str.replace(/\n|\r|MainWindowTitle : /g, '')
	let dash = wt.indexOf('-')

	return {
		artist: wt.substring(0, dash - 1),
		song:   wt.substring(dash + 2) // until the next dash? exclude features
	}
}

(function myLoop(last) {
	setTimeout(() => {
		child_proc.exec(cmd, function(err, stdout, stderr) {
			if(err)
				throw err

			let now = handlePowershellCommand(stdout)
			if(last.artist !== now.artist && last.song !== now.song) {
				for(let i = 0; i < 10; i++)
					console.log('\n\n\n\n\n\n\n\n\n\n')
				console.log('  Playing:', now.artist, '-', now.song)
				console.log('---------------------------------------------------------')
				lyrics(now.artist + '/' + now.song, (err, data) => {
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
			myLoop(now);
		})
	}, 2000)
})('')