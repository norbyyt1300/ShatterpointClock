var regularTimeMinutes = 0;
var missionCriticalTimeMinutes = 0;

let player1Time = 0;
let player2Time = 0;
let player1Timer = null;
let player2Timer = null;
let isPaused = false;   // Track if the clock is paused
let currentTimer = null;

const timeUpAudio = new Audio('timeup.mp3');

saveSettings();

// Saves settings from the settings modeal
function saveSettings() {
    console.log("Saving settings...");

    regularTimeMinutes = parseInt(document.getElementById("regularTimeMinutesInput").value);
    missionCriticalTimeMinutes = parseInt(document.getElementById("missionCriticalTimeMinutesInput").value);
    
    player1Time = (regularTimeMinutes + missionCriticalTimeMinutes) * 60;
    player2Time = (regularTimeMinutes + missionCriticalTimeMinutes) * 60;

    updateClock();
}

// Update the time display
function updateClock() {
    const player1Minutes = Math.floor(player1Time / 60);
    const player1Seconds = player1Time % 60;
    //document.getElementById("player1Time").textContent = `${padTime(player1Minutes)}:${padTime(player1Seconds)}`;

    updatePlayerRegularTimeClockHTML("player1RegularTime", player1Time);
    updatePlayerMissionCriticalTimeClockHTML("player1MissionCriticalTime", player1Time);

    const player2Minutes = Math.floor(player2Time / 60);
    const player2Seconds = player2Time % 60;
    //document.getElementById("player2Time").textContent = `${padTime(player2Minutes)}:${padTime(player2Seconds)}`;
    updatePlayerRegularTimeClockHTML("player2RegularTime", player2Time);
    updatePlayerMissionCriticalTimeClockHTML("player2MissionCriticalTime", player2Time);
}

// Generate HTML for a player's clock, given the minutes and seconds remaining
function updatePlayerRegularTimeClockHTML(elementId, playerTime) {
    var element = document.getElementById(elementId);
    if (playerTime <= missionCriticalTimeMinutes * 60) {
        element.innerHTML = "00:00";
        element.style.color = "gray";
    } else {
        var minutes = Math.floor((playerTime - 60 * missionCriticalTimeMinutes) / 60);
        var seconds = playerTime % 60;
        var html = padTime(minutes) + ":" + padTime(seconds);
        element.innerHTML = html;
        element.style.color = "black";
    }
}

function updatePlayerMissionCriticalTimeClockHTML(elementId, playerTime) {
    var element = document.getElementById(elementId);
    if (playerTime <= missionCriticalTimeMinutes * 60) {
        var minutes = Math.floor((playerTime) / 60);
        var seconds = playerTime % 60;
        var html = padTime(minutes) + ":" + padTime(seconds);
        element.innerHTML = html;
        element.style.color = "black";
        element.style.backgroundColor = "pink";
    } else {
        element.innerHTML = padTime(missionCriticalTimeMinutes) + ":00";
        element.style.color = "gray";
    }
}

// Pad time with leading zero if needed
function padTime(time) {
    return time < 10 ? '0' + time : time;
}

// Start/Stop logic for Player 1
function togglePlayer1() {
    if (isPlayer2Turn) return;  // Do nothing if someone clicks the player 1 clock while its player 2's turn
    if (isPaused) return; // Do nothing if paused
    navigator.vibrate(200);
    if (player1Timer) {
        // Stop Player 1's clock
        clearInterval(player1Timer);
        player1Timer = null;
        // Start Player 2's clock
        startPlayer2();
    } else {
        // Start Player 1's clock
        startPlayer1();
    }
}

var isPlayer1Turn = false;
function startPlayer1() {
    isPlayer1Turn = true;
    isPlayer2Turn = false;
    if (player1Timer) return;
    player1Timer = setInterval(() => {
        if (player1Time > 0) {
            player1Time--;
            updateClock();
        } else {
            stopPlayer1();
            timeUpAudio.play();
            navigator.vibrate(2000);
            alert("Player 1's time is up!");
        }
    }, 1000);
}

function stopPlayer1() {
    clearInterval(player1Timer);
    player1Timer = null;
}

// Start/Stop logic for Player 2
function togglePlayer2() {
    if (isPlayer1Turn) return;  // Do nothing if someone clicks the player 2 clock while its player 1's turn
    if (isPaused) return; // Do nothing if paused
    navigator.vibrate(200);
    if (player2Timer) {
        // Stop Player 2's clock
        clearInterval(player2Timer);
        player2Timer = null;
        // Start Player 1's clock
        startPlayer1();
    } else {
        // Start Player 2's clock
        startPlayer2();
    }
}

var isPlayer2Turn = false;
function startPlayer2() {
    isPlayer1Turn = false;
    isPlayer2Turn = true;
    if (player2Timer) return;
    player2Timer = setInterval(() => {
        if (player2Time > 0) {
            player2Time--;
            updateClock();
        } else {
            stopPlayer2();
            timeUpAudio.play();
            navigator.vibrate(2000);
            alert("Player 2's time is up!");
        }
    }, 1000);
}

function stopPlayer2() {
    clearInterval(player2Timer);
    player2Timer = null;
}

// Event listeners to start and stop the timers when clicked
document.getElementById("player1Clock").addEventListener("click", togglePlayer1);
document.getElementById("player2Clock").addEventListener("click", togglePlayer2);
document.getElementById("saveSettingsButton").addEventListener("click", saveSettings);


// Pause/Resume Button Event
document.getElementById("pauseBtn").addEventListener("click", togglePause);

// Pause/Resume Logic
function togglePause() {
    if (isPaused) {
        // Resume the clock
        isPaused = false;
        document.getElementById("pauseBtn").innerHTML = "&#x23F8"; // Pause icon
        if (currentTimer === "player1") {
            startPlayer1();
        } else if (currentTimer === "player2") {
            startPlayer2();
        }
    } else {
        // Pause the clock
        isPaused = true;
        document.getElementById("pauseBtn").innerHTML = "&#9654"; // Play icon
        clearInterval(player1Timer);
        clearInterval(player2Timer);
        player1Timer = null;
        player2Timer = null;
    }
}

// Initial clock update
updateClock();









var noSleep = new NoSleep();

var wakeLockEnabled = false;
var toggleEl = document.querySelector("#toggle");
toggleEl.addEventListener('click', function() {
    if (!wakeLockEnabled) {
        noSleep.enable(); // keep the screen on!
        wakeLockEnabled = true;
        toggleEl.style.backgroundColor = "green";

        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
        }
    } else {
        noSleep.disable(); // let the screen turn off.
        wakeLockEnabled = false;
        toggleEl.style.backgroundColor = "";
    }
}, false);