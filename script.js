setInterval(timer, 1000);

const arr = [1, [1, 2], 5, [5, 8, [2, 7, 9]]];
let nar = [];

console.log(arr);
const flat = (a) => {
  a.forEach((element) => {
    if (Array.isArray(element)) {
      flat(element);
    } else {
      nar.push(element);
    }
  });
};
flat(arr);
console.log(nar);

let seconds = 0,
  minutes = 0,
  hours = 0;

let countdownTime = 0;

let activeTime = 10,
  restTime = 10,
  totalSetTime = activeTime + restTime;

let curSetTime = 0;

let sets = 5;
let activeSet = 1;
let laps = 3;
let activeLap = 1;
let lapRestTime = 50;
let isRest = false,
  isLapRest = false;
let curLapRestTime = 0;

let isCounting = false;

let workSound = new Audio("work2.mp3");
let restSound = new Audio("rest2.mp3");
let tickSound = new Audio("finalTicks.mp3");

setWork();
updateLapCount();
updateSets();

function startTimer() {
  isCounting = true;
  totalSetTime = activeTime + restTime;
  countdownTime = activeTime;
}
function resumeTimer() {
  isCounting = true;
}
function stopTimer() {
  isCounting = false;
  tickSound.pause();
  tickSound.currentTime = 0;
}
function timer() {
  if (!isCounting) return;
  // total timer
  seconds++;
  if (seconds >= 60) {
    seconds = 0;
    minutes++;
  }
  if (minutes >= 60) {
    minutes = 0;
    hours++;
  }

  curSetTime++;
  if (curSetTime >= totalSetTime) {
    if (isLapRest) {
      isLapRest = false;
      activeSet = 1;
      totalSetTime = activeTime + restTime;
      setWork();
      updateSets();
      updateLapCount();
      updateTimerMarkers();
      updateParams();
    } else {
      activeSet++;
      totalSetTime = activeTime + restTime;
      updateSets();
    }
    curSetTime = 0;
  }
  // start new lap
  if (activeSet > sets) {
    activeSet = 0;
    activeLap++;
    curSetTime = 0;
    setRest();
    countdownTime = lapRestTime;
    totalSetTime = lapRestTime;
    updateTimerMarkers();
    isLapRest = true;
    updateSets();
    updateLapCount();
    updateParams();
  }
  if (!isLapRest) {
    if (activeTime <= curSetTime && !isRest) setRest();
    if (activeTime > curSetTime && isRest) setWork();
  }
  countdownTime--;
  if (countdownTime == 5) tickSound.play();

  updateTimer();
}
function addSecond() {
  seconds++;
  curLapRestTime--;
  if (seconds >= 60) {
    seconds = 0;
    minutes++;
    if (!isLapRest) {
      activeSet++;
      updateSets();
    }
  }
  if (minutes >= 60) {
    minutes = 0;
    hours++;
  }
  if (activeSet > sets) {
    activeSet = 1;
    activeLap++;
    isLapRest = true;
    isRest = true;
    curLapRestTime = lapRestTime;
    updateSets();
    updateLapCount();
  }
  if (curLapRestTime < 0 && isLapRest) {
    isLapRest = false;
    isRest = false;
  }
  countdownTime--;
  updateTimer();
}
function updateTimer() {
  document.getElementById("total-timer").innerHTML =
    "<span class='total-timer-lable'>total time:</span> " +
    ("0" + hours).slice(-2) +
    ":" +
    ("0" + minutes).slice(-2) +
    ":" +
    ("0" + seconds).slice(-2);
  document.getElementById("timer-text").style.color = isRest
    ? "#922222"
    : "#1f1f1f";
  document.getElementById("timer-text").innerHTML = countdownTime;

  document.getElementById("time-pointer").style.left =
    (curSetTime / totalSetTime) * 100 + "%";
}

function setWork() {
  isRest = false;
  document.getElementById("work-or-rest").innerHTML = "Work!";
  countdownTime = activeTime + 1;
  workSound.play();
}
function setRest() {
  isRest = true;
  document.getElementById("work-or-rest").innerHTML = "Rest!";
  countdownTime = restTime + 1;
  restSound.play();
}
function addActiveTime() {
  if (activeTime < 60) activeTime += 5;
  totalSetTime = activeTime + restTime;
  updateParams();
}
function reduceActiveTime() {
  if (activeTime > 0) activeTime -= 5;
  totalSetTime = activeTime + restTime;
  updateParams();
}
function addRestTime() {
  if (restTime < 60) restTime += 5;
  totalSetTime = activeTime + restTime;
  updateParams();
}
function reduceRestTime() {
  if (restTime > 0) restTime -= 5;
  totalSetTime = activeTime + restTime;
  updateParams();
}
function addSets() {
  if (sets < 15) sets++;
  updateParams();
  updateSets();
}
function reduceSets() {
  if (sets > 1) sets--;
  updateParams();
  updateSets();
}
function addLap() {
  if (laps < 10) laps++;
  updateParams();
  updateLapCount();
}
function reduceLap() {
  if (laps > 1) laps--;
  updateParams();
  updateLapCount();
}
function addLapRestTime() {
  if (lapRestTime < 600) lapRestTime += 5;
  updateParams();
}
function reduceLapRestTime() {
  if (lapRestTime > 0) lapRestTime -= 5;
  updateParams();
}
function updateLapCount() {
  document.getElementById("laps").innerHTML = "";
  for (let i = 1; i <= laps; i++) {
    let activeState =
      i == activeLap
        ? isLapRest
          ? ""
          : " active-lap"
        : i < activeLap
        ? " past-lap"
        : "";
    /*
    if (i != 1) {
      document.getElementById("laps").innerHTML +=
        "<div class='lap" +
        (isLapRest
          ? " active-lap"
          : activeState == " active-lap"
          ? " past-lap"
          : "") +
        "'>Rest </div>";
    }*/
    document.getElementById("laps").innerHTML +=
      "<div class='lap" + activeState + "'>Lap " + i + "</div>";
  }
}
function updateSets() {
  document.getElementById("sets").innerHTML = "";
  for (let i = 1; i <= sets; i++) {
    document.getElementById("sets").innerHTML +=
      "<div class='lap" +
      (i == activeSet ? " active-lap" : "") +
      (i < activeSet ? " past-lap" : "") +
      "'>Set " +
      i +
      "</div>";
  }
}
function updateParams() {
  document.getElementById("active-time").innerHTML = activeTime + "s";
  document.getElementById("rest-time").innerHTML = restTime + "s";
  document.getElementById("meter-bar").style.width =
    (isLapRest ? "0" : (activeTime / totalSetTime) * 100) + "%";
  document.getElementById("sets-count").innerHTML = sets;
  document.getElementById("laps-count").innerHTML = laps;
  document.getElementById("laps-rest").innerHTML = lapRestTime + "s";
  updateTimerMarkers();
}
function updateTimerMarkers() {
  document.getElementById("time-markers").innerHTML = "";
  for (let i = 0; i <= totalSetTime; i += 5) {
    let mark = i;
    if (totalSetTime >= 30)
      mark = i % 15 == 0 ? i : i == totalSetTime ? i : "|";
    document.getElementById("time-markers").innerHTML +=
      "<div class='time-marker'>" + mark + "</div>";
  }
}
