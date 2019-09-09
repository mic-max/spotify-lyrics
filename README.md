# spotify-lyrics

#### Requirements
- Windows Operating System
- Spotify Desktop Application

#### Instructions
###### Run using Node
0. [Download](https://nodejs.org/en/download/) and Install Node.js
1. `npm install`
2. `npm start`

_or_
###### Build Executable (currently broken)
0. [Download](https://nodejs.org/en/download/) and Install Node.js
1. `npm install`
2. `npm install nexe -g`
3. `npm run-script dist`
4. `./bin/spotify-lyrics-win.exe`

_or_
###### Download Executable
0. [Download](#download-executable) - Not available yet
1. Run the executable from a terminal

#### Images
![screenshot](https://github.com/mic-max/spotify-lyrics/blob/master/demo.png)

#### Submission
0. Run test suite `npm test`
1. Run linter `npm run lint`
2. Test run a few songs

#### Future Development Ideas
- move spotify current song into a separate module
  - then will run the corresponding script to get the song name and artist
  - plus any other information easily available

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
  - order of lyrics websites to query

- support mac os
  - use an applescript to get window information maybe
  - run script with osascript /path/to/file.scpt

- have a better console interface
  - always print the song title at the top of the screen
    - working for songs that have less lines than your terminal :)
    - look into a way to scroll cursor, or use an ncurses-esque library
  - have some sort of scrolling for the lyrics along with how far into the song they are?
    - hard because i don't think we can know if the user skips along in the song, or listens to it twice in a row
    - pausing does work, will need to know length of song in seconds and implement an algorithm for karaoke rendering
    - or get song info with timestamps on each line ex. [00:05] 