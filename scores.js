var counter = document.getElementById('counter');
var combo = document.getElementById('combo');
var socket = new ReconnectingWebSocket(`ws://${settings.ip}:${settings.port}/room/${settings.room}`);

var multiplierList = [{multiplier: 1, progress: 0.0}, {multiplier: 1, progress: 0.5}, {multiplier: 2, progress: 0.0}, {multiplier: 2, progress: 0.25}, {multiplier: 2, progress: 0.5}, {multiplier: 2, progress: 0.75}, {multiplier: 4, progress: 0.0}, {multiplier: 4, progress: 0.125}, {score: 8, multiplier: 4, progress: 0.25}, {multiplier: 4, progress: 0.375}, {multiplier: 4, progress: 0.5}, {multiplier: 4, progress: 0.625}, {multiplier: 4, progress: 0.75}, {multiplier: 4, progress: 0.875}, {multiplier: 8, progress: 0.0}]

odometerOptions = { auto: false };

if (p == 0) {
    var o = 1
} else {
    var o = 0
}

const sleep = ms => new Promise(resolve => {
    setTimeout(() => { resolve() }, ms)
})

odCounter = new Odometer({
  el: counter,
  value: 0,

  // Any option (other than auto and selector) can be passed in here
  format: '(ddd).d'
});

odCounter.update(100000000000)

var current_score = 0
var prev_score = 0
var current_combo = 0
var prev_combo = 0
var prev_multiplier = [1, 0]
var setting_score = false
var current_pos = 1

var posElement = document.getElementById('pos')

var bar=new RadialProgress(document.getElementById("bar"), {thick:10,colorBg:"rgba(255,255,255,0.2)",colorFg:"#FFFFFF",noPercentage:true, animationSpeed: 2})
bar.setText('<p class="font_beon" style="font-size:200%; letter-spacing=1px"><sup style="font-size:40%;">x</sup>1</p>')

socket.onopen = function (event) {
    console.log('Connected');
};

// od.update()



const loop = async () => {
    if (current_combo != prev_combo) {
        prev_combo = current_combo
        setMultiplier(current_combo)
    }
    if (current_score != prev_score) {
        odCounter.update(100000000000 + current_score * 10)
        prev_score = current_score
        await sleep(190)
    }
    await sleep(10)
    loop()
}

function setMultiplier (totalCombo) {
    var set = multiplierList[totalCombo] || {multiplier: 8, progress: 0.0};
    if (set.multiplier != prev_multiplier) {
        bar.setText(`<p class="font_beon" style="font-size:200%; letter-spacing=1px"><sup style="font-size:40%;">x</sup>${set.multiplier}</p>`)
        bar.setValue(set.progress)
        prev_multiplier = [set.multiplier, set.progress]
    }
}

socket.onmessage = async function (event) {
    var data = JSON.parse(event.data)
    if (data.commandType === "UpdatePlayerInfo") {
        if (data.data[p]) {
            if (data.data[p].playerScore != current_score) {
                current_score = data.data[p].playerScore
            }
            // if (data.data[0].playerComboBlocks != current_combo) {
            //     current_combo = data.data[0].playerComboBlocks
            // }
            if (current_combo != data.data[p].playerComboBlocks) {
                current_combo = data.data[p].playerComboBlocks
                combo.innerHTML = current_combo
            }
            if (data.data[o]) {
                if (data.data[p].playerScore >= data.data[o].playerScore && current_pos == 2) {
                    posElement.innerHTML = '1<sup style="font-size:40%;">st</sup>'
                    current_pos = 1
                } else if (data.data[p].playerScore < data.data[o].playerScore && current_pos == 1) {
                    posElement.innerHTML = '2<sup style="font-size:40%;">nd</sup>'
                    current_pos = 2
                }
            }
        }
    }
    
}

loop()