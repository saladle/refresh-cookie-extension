document.addEventListener("DOMContentLoaded", function () {
  const startButton = document.getElementById("startButton");
  const stopButton = document.getElementById("stopButton");

  startButton.addEventListener("click", function () {
    console.log("click start");
    chrome.runtime.sendMessage({ action: "start" });
  });

  stopButton.addEventListener("click", function () {
    console.log("click stop");
    chrome.runtime.sendMessage({ action: "stop" });
  });
});
