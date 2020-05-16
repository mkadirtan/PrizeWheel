let ctx = canvas.getContext('2d');
let width = 245; // size
let center = canvas.width/2;      // center
let isStopped = false;
let lock = false;
let isStarted = false;
let mins = 2;
let seconds = 0;

let sliceDegs = [];
let label = [];
let color = [];

function rand(min, max) {
    return Math.random() * (max - min) + min;
}

let deg = rand(0, 360);
let speed = 0;
let slowDownRand = 0;

function deg2rad(deg) {
    return deg * Math.PI/180;
}

function anim() {
    deg += speed;
    deg %= 360;

    // Increment speed
    if (!isStopped && speed < 1.8) {
        speed = speed + 1 * 0.1;
    }
    // Decrement Speed
    if (isStopped) {
        if (!lock) {
            lock = true;
            slowDownRand = rand(0.994, 0.998);
        }
        speed = speed > 0.2 ? speed *= slowDownRand : 0;
    }
    if(lock && !speed){
        let lastDegree = ((360 - deg - 90) % 360)
        if(lastDegree < 0 ) lastDegree += 360;
        let condition = true;
        let i = 0;
        let totalDegs = 0;
        let ai;
        while(condition){
            totalDegs += sliceDegs[i];
            if(totalDegs > lastDegree){
                ai = i;
                break;
            }
            i++;
        }
        //ai = (totalDegs.length+ai)%totalDegs.length; // Fix negative index
        $('#time')[0].textContent = "Son Kazanan : " + label[ai];
        $('#winnerList')[0].append(peopleList.items[ai].elm)
        enableStartButton(false, ai);
    }
    drawImg();
    window.requestAnimationFrame( anim )
}

function spinnerAdd(){
    const n = peopleList.items.length;
    let totalTickets = 0;
    sliceDegs = [];
    label = [];
    color = [];
    for(let i = 0; i < n; i++){
        totalTickets += parseInt(peopleList.items[i].values().chance);
    }
    for(let i = 0; i < n; i++){
        sliceDegs[i] = (parseInt(peopleList.items[i].values().chance)/totalTickets)*360;
        label[i] = peopleList.items[i].values().name;
        color[i] = peopleList.items[i].values().color;
    }
    if(n>1 && !isStarted) {
        anim();
        isStarted = true;
        const iMins = parseInt($('#mins')[0].value);
        const iSeconds = parseInt($('#seconds')[0].value);

        $('#times')[0].style.display = "none"
        if(typeof iMins === typeof 5 && !isNaN(iMins)){
            mins = iMins;
        }
        if(typeof iSeconds === typeof 5 && !isNaN(iSeconds)){
            seconds = iSeconds;
        }

        var timerInterval = setInterval(timeHandler, 1000)
        function timeHandler(){
            //if(isStopped){ $('#time')[0].textContent = "Süre doldu!"; return;}
            if(seconds < 10){
                $('#time')[0].textContent = mins + ":0" + seconds;
            } else {
                $('#time')[0].textContent = mins + ":" + seconds;
            }

            if(mins > 0 && seconds < 1){
                seconds = 59;
                mins -= 1;
            } else {
                seconds -= 1;
            }
            if(mins < 1 && seconds < 1){
                clearInterval(timerInterval);
                $('#time')[0].textContent = "Süre doldu!";
            }
        }
    }
}

enableStartButton(true);

function enableStartButton(isFirstTime, ai){
    if(isFirstTime){
        $('#start-wheel')[0].onclick = () => {
            mins = 0;
            seconds = 0;
            setTimeout(()=>{isStopped = true}, 4000);
            $('#start-wheel')[0].onclick = () => {};
            for(let i = 0; i < 10; i++){
                setTimeout(()=>{speed += 1}, 200*i)
            }
        }
    } else {
        $('#start-wheel')[0].onclick = () => {
            isStopped = false;
            speed = 1.79;
            peopleList.remove('id', peopleList.items[ai].values().id);
            spinnerAdd();
            for(let i = 0; i < 10; i++){
                setTimeout(()=>{speed += 1}, 100*i)
            }
            setTimeout(()=>{
                isStopped=true;
                $('#start-wheel')[0].onclick = () => {};
            }, 4000)
            $('#start-wheel')[0].onclick = () => {};
        }
    }

}

function drawSlice(deg, color, offset) {
    ctx.beginPath();
    ctx.fillStyle = color;
    ctx.moveTo(center, center);
    ctx.arc(center, center, width/2, deg2rad(deg), deg2rad(deg+offset));
    ctx.lineTo(center, center);
    ctx.fill();
}


function drawText(deg, text) {
    ctx.save();
    ctx.translate(center, center);
    ctx.rotate(deg2rad(deg));
    ctx.textAlign = "left";
    ctx.fillStyle = "#fff";
    ctx.font = '30px sans-serif';
    ctx.fillText("\ \ " + text, 15, 10);
    ctx.restore();
}

function drawImg() {
    ctx.clearRect(0, 0, width, width);
    for(let i = 0; i < color.length; i++){
        drawSlice(deg, color[i], sliceDegs[i]);
        drawText(deg+sliceDegs[i]/2, label[i]);
        deg += sliceDegs[i];
    }
}


