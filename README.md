# spotify-lyrics

#### Requirements
- Windows Operating System
- Spotify Desktop Application

#### Instructions
###### Run using Node
0. [Download](https://nodejs.org/en/download/) and Install Node.js
1. `npm install`
2. `pip install -U pillow`
3. Open spotify and play a song
4. `npm start --fullscreen`

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
![screenshot](../media/demo.png?raw=true)

#### Submission
0. Run test suite `npm test`
1. Run linter `npm run lint`
2. Test run a few songs

Command to copy all JFIF files from spotify cache directory up a level
`C:/Users/PROLE/AppData/Local/Packages/SpotifyAB.SpotifyMusic_zpdnekdrzrea0/LocalCache/Spotify/Data`
`find . -type f | xargs file | grep JFIF | cut -d':' -f1 | xargs -I {} cp {} .`
Next step will be to rename all these files to have a .jfif extension
`find . -maxdepth 1 -type f | cut -d'.' -f2 | xargs -I {} mv .{}.file .{}.jfif`
Now that we have a directory of album art that spotify has cached, can we tell which one is the current song?
Check other files that have been modified recently for information... hex file name?
`cd C:\Users\PROLE\AppData\Local\Packages\SpotifyAB.SpotifyMusic_zpdnekdrzrea0\LocalCache\Spotify\Browser\Cache`
`mkdir hi`
`find . -maxdepth 1 -type f | xargs file | grep JFIF | cut -d':' -f1 | xargs -I {} cp {} ./hi/{}.jfif`


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

- bug where if cmder is minimized the song colours are weird