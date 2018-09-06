var socket = new ReconnectingWebSocket(`ws://${settings.ip}:${settings.port}/room/${settings.room}`);
var nameElement = document.getElementById("name");
var metaOneElement = document.getElementById("metaOne");

socket.onopen = function (event) {
    console.log('Connected');
};

const sleep = ms => new Promise(resolve => {
    setTimeout(() => { resolve() }, ms)
})

var bar=new RadialProgress(document.getElementById("bar"), {thick:10,colorBg:"rgba(255,255,255,0.2)",colorFg:"#FFFFFF",noPercentage:true, noAnimations: true})

bar.setText('0:00')

async function GetTrackInfo(id) {
    let response = await fetch(` https://beatsaver.com/api/songs/search/hash/${id}`);
    try {
        if (response.ok) {
            let data = await response.json();
            let song = data.songs[0];
            return {name: song.songName, subname: song.songSubName, uploader: song.uploader, author: song.authorName, bpm: song.bpm};
        }
        return null;
    } catch (e) {
        console.log(e)
        return null;
    }
}

const time_loop = async (time) => {
    time_remaining = time
    time_passed = 0
    while (time_remaining > 0) {
        // Do stuff
        time_remaining -= 1
        var minutes = Math.floor(time_passed / 60)
        var seconds = time_passed - minutes * 60
        var progress = time_passed / time
        secondsFormatted = ("0" + seconds).slice(-2);
        bar.setText(`${minutes}:${secondsFormatted}`)
        bar.setValue(progress)
        await sleep(1000)
        time_passed += 1
    }
    bar.setValue(1)
}

socket.onmessage = async function (event) {
    var data = JSON.parse(event.data)
    if (data.commandType === "StartLevel") {
        nameElement.innerHTML = data.data.song.songName;
        let songInfo = await GetTrackInfo(data.data.song.levelId);
        if (songInfo) {
            var author = `${songInfo.author} | ` || ''
            nameElement.innerHTML = songInfo.name;
            metaOneElement.innerHTML = `${author}Beatmap by ${songInfo.uploader} | ${songInfo.bpm} BPM`
        } else {
            metaOneElement.innerHTML = ''
        }
        await time_loop(data.data.song.songDuration)
    } else if (data.commandType === "SetSelectedSong") {
        bar.setText("0:00")
        bar.setValue(0)
        if (data.data) {
            nameElement.innerHTML = data.data.songName;
            let songInfo = await GetTrackInfo(data.data.levelId);
            if (songInfo) {
                var author = `${songInfo.author} | ` || ''
                nameElement.innerHTML = songInfo.name;
                metaOneElement.innerHTML = `${author}Beatmap by ${songInfo.uploader} | ${songInfo.bpm} BPM`
            } else {
                metaOneElement.innerHTML = ''
            }
        }
    }
}
