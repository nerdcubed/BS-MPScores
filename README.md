# BS-MPScores
Custom score tracker for the Beat Saber Multiplayer mod. Designed to be imported into OBS via the Browser Source. Example below:

![](https://i.imgur.com/VcQZ9sz.jpg)

## Setup
Clone this repository, and then copy `config.js.example` to `config.js`. Open up this file in your IDE and change the following information:

 - `ip` - The IP of the server you're connecting to
 - `port` - The port the server is running on (Default: 3701)
 - `room` - The room number to check the scores from (Default: 1)

**It is important that the multiplayer server is setup for tournament mode, with the room your connecting to setup as a permanent room.**

`player1.html` is the left aligned score, which fetches the score of the first player in the room (A.K.A the host)  
`player2.html` is the right aligned score, which fetches the score of the second player in the room (A.K.A the guest)  
`level.html` displays the currently playing song, along with the progress  

In terms of browser source settings, for the two scores I used the default 800 by 600 resolution, and for the level info I used 1920 by 1080 as the resolution, with every source set to 60 frames per second.

## Known Issues
 - Due to the way it's designed, the left score `player1.html` will always be the host and vice versa. As a result, if the host disconnects, then Player 2's score will switch over to the left as they're now the host. Also, sometimes the MP server randomly switches host after a song ends, which causes the scores to swap places.
 - Since it's realtime, it will always be ahead of any RTMP stream that's being shown
 - The code is terribly written.

## Sources
 - [odometer.js from HubSpot](https://github.com/HubSpot/odometer) (Licensed under MIT)
 - [reconnecting-websocket.js from Joe Walnes](https://github.com/joewalnes/reconnecting-websocket) (Licensed under MIT)
 - [radialprogress.js from Federico Dossena](https://fdossena.com/?p=html5cool/radprog/i.frag)
