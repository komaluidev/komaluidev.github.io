const btnStart = document.getElementById("btn-start");
const btnPause = document.getElementById("btn-pause");
const btnStop = document.getElementById("btn-stop");

const TimerDisplay = document.getElementById("timer");

let duration = 25 * 60;
let timeInterval;

const updateTimer = () => {
  let minutes = Math.floor(duration / 60); //25
  let seconds = duration % 60; // 25 seconds will be zero

  TimerDisplay.textContent = `${String(minutes).padStart(2, "0")}:${String(
    seconds
  ).padStart(2, "0")}`;
};

const startTimer = () => {
  timeInterval = setInterval(() => {
    duration--;
    updateTimer();

    if (duration === 0) {
      clearInterval(timeInterval);
      duration = 25 * 60;
      updateTimer();
    }
  }, 1000);
};

const stopTimer = () => {
  clearInterval(timeInterval);
  duration = 25 * 60;
  updateTimer();
};

const pauseTimer = () => {
  clearInterval(timeInterval);
  console.log("timer paused");
};

btnStart.addEventListener("click", () => {
  console.log("clicked");
  startTimer();
});
btnStop.addEventListener("click", () => {
  console.log("Timer stoped");
  stopTimer();
});
btnPause.addEventListener("click", () => {
  console.log("Timer paused");
  pauseTimer();
});
