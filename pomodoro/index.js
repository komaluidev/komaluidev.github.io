const btnStart = document.getElementById("btn-start");
const btnPause = document.getElementById("btn-pause");


const TimerDisplay = document.getElementById("timer");
const pauseIcon = btnPause.querySelector("i");
const completedSessionsDisplay = document.getElementById("completedSessions");

//set state
let duration = 25 * 60;
let timeInterval;
let isRunning = false;
let isPause = false;

const updateTimer = () => {
  let minutes = Math.floor(duration / 60); //25
  let seconds = duration % 60; // 25 seconds will be zero

  TimerDisplay.textContent = `${String(minutes).padStart(2, "0")}:${String( seconds).padStart(2, "0")}`;
};

const updateButton = () => {

  if (isRunning || isPause) {
    btnStart.classList.add("hidden");
    btnPause.classList.remove("hidden");
  
  } else {
    btnStart.classList.remove("hidden");
    btnPause.classList.add("hidden");
  }
};


//get localStorage value
let completedSessions = 0;
const value = localStorage.getItem("count");
if (value) {
  completedSessions = JSON.parse(value);
  completedSessionsDisplay.textContent = completedSessions;
}

console.log("value", completedSessions);
updateTimer();
updateButton();

const startTimer = () => {
  clearInterval(timeInterval);

  isRunning = true;
  isPause = false;

  updateButton();

  timeInterval = setInterval(() => {
    duration--;
    updateTimer();

    if (duration === 0) {
      clearInterval(timeInterval);
      completedSessions++;

      localStorage.setItem("count", JSON.stringify(completedSessions));
      completedSessionsDisplay.textContent = completedSessions;

      duration = 25 * 60;
      updateTimer();

      isRunning = false;
      isPause = false;
      updateButton();
      console.log("session complted");
    }
   
  }, 1000);
};

//pause timer function
const pauseTimer = () => {
  clearInterval(timeInterval);

  if (isPause) {
    isPause = false;
    isRunning = true;
    if (pauseIcon) {
      pauseIcon.className = "fa-solid fa-pause";
    }
    startTimer();
    console.log("timer resume");
  } else {
    isPause = true;
    isRunning = false;
    if (pauseIcon) {
      pauseIcon.className = "fa-solid fa-play";
    }
    console.log("timer paused");
  }
  updateButton();
};

btnStart.addEventListener("click", () => {
  console.log("clicked");
  startTimer();
});

btnPause.addEventListener("click", () => {
  console.log("Timer paused");
  pauseTimer();
});

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js')
      .then(registration => {
        console.log('ServiceWorker registration successful with scope: ', registration.scope);
      })
      .catch(error => {
        console.error('ServiceWorker registration failed: ', error);
      });
  });
}
