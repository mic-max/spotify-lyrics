# spotify-lyrics

#### Requirements
- [Download](https://nodejs.org/en/download/) and Install Node.js
- Windows Operating System
- Spotify Desktop Application

#### Instructions
###### Run using Node
1. `npm install`
2. `node app`

_or_
###### Build Executable
1. `npm install`
2. `npm run-script dist`
3. `./bin/spotify-lyrics-win.exe`

_or_
###### Download Executable
1. [Download](#) - Not available yet
2. Run the executable

#### Images
![screenshot](https://github.com/mic-max/spotify-lyrics/blob/master/demo.png)

#### Future Development Ideas
- move spotify current song into a separate module
  - will have a way of determining OS
  - then will run the corresponding script to get the song name and artist
  - plus any other information easily available
  - if i made it into a .exe: the system type would already be known
  - so would only need to package a single spotify script
  - but would need a different exe for windows, mac and linux

- separate log file into a module
  - when the log is long enough* send it to a server, then delete the user's version
  - have a way to sift through which songs worked and didn't

- add caching to played songs
  - instead of hitting the lyrics service, use the stored local copy
  - save it to user's temp folder? os.tmpdir()/spotify-lyrics/songs/TheBeatles/Girl.txt
  - this would enable offline use for songs already played with the app running

- have different lyric website support
  - azlyrics, genius, musixmatch, etc.
  - the program should try all of these in succession until proper lyrics are found

- add colours to the lyrics printed to the console
  - different for title, [chorus x2]
  - put the (ay, ay, ay) - background vocals in a duller font colour
  - order of lyrics websites to query

- have the program packaged into a .exe
  - users won't have to install nodejs or create a script to run it
  - would have to be platform specific...

- have a better console interface
  - always print the song title at the top of the screen
  - get size of terminal with: process.stdout.columns, process.stdout.rows
  - even if we just print the entire lyrics, still try to have the start of them at the top of the console
  - https://nodejs.org/api/tty.html and an event for console resize
  - clear the screen with the right amount of lines
  - only have the chorus printed once
  - have some sort of scrolling for the lyrics along with how far into the song they are?
  - hard because i don't think we can know if the user skips along in the song, or listens to it twice in a row
  - pausing does work, will need to know length of song in seconds and implement an algorithm for karaoke rendering
