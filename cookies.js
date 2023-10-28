
const cookiesList = []
let currentUrl = ''

async function showCookiesForTab(tabs) {
  //get the first tab object in the array
  let tab = tabs.pop();
  currentUrl = tab.url || ''

  //get all cookies in the domain
  try {
    let gettingAllCookies = chrome.cookies.getAll({url: tab.url});
    gettingAllCookies.then((cookies) => {

      //set the header of the panel
      let activeTabUrl = document.getElementById('header-title');
      let text = document.createTextNode("Cookies at: "+tab.title);
      let cookieList = document.getElementById('cookie-list');
      activeTabUrl.appendChild(text);

      if (cookies.length > 0) {
        //add an <li> item with the name and value of the cookie to the list
        for (let cookie of cookies) {
          cookiesList.push(cookie)

          let liElement = document.createElement("li");
          liElement.className = "list-group-item d-flex justify-content-between align-items-start overflow-auto"

          let divElementItem = document.createElement("div");
          divElementItem.className = "ms-2 me-auto"

          let divElementTitle = document.createElement("div");
          divElementTitle.className = "fw-bold"
          let textCookieName = document.createTextNode(cookie.name);
          divElementTitle.appendChild(textCookieName)
          
          let textCookieValue = document.createTextNode(cookie.value);
          divElementItem.appendChild(divElementTitle)
          divElementItem.appendChild(textCookieValue)

          liElement.appendChild(divElementItem);
          cookieList.appendChild(liElement);
        }
      } else {
        let p = document.createElement("p");
        p.className = "text-center fw-bold bg-warning p-3"
        let content = document.createTextNode("No have cookies in this tab.");
        let parent = cookieList.parentNode;

        p.appendChild(content);
        parent.appendChild(p);

        // remove all items
        while (cookieList.hasChildNodes()) {
          cookieList.removeChild(cookieList.firstChild);
        }
      }
    }); 
  } catch (error) {
    console.log("error:", error)
  }
}

//get active tab to run an callback function.
//it sends to our callback an array of tab objects
async function getActiveTab() {
  const data = await chrome.tabs.query({currentWindow: true, active: true});
  return data
}
getActiveTab().then(showCookiesForTab);

let targetUrl = ''
const urlInputElement = document.getElementById("urlInput");
let buttonSubmit = document.getElementById("transferButton")
let buttonReset = document.getElementById("resetCookies")

targetUrl = urlInputElement.value

urlInputElement.addEventListener("change", function () {
  targetUrl = urlInputElement.value
});

buttonSubmit.addEventListener("click", function () {
  buttonSubmit.classList.add('disabled')
  buttonSubmit.textContent = 'Loading...'

  setTimeout(() => {
    if(cookiesList.length > 0){
      for(let cookie of cookiesList){
        chrome.cookies.set({
          url: targetUrl,
          name: cookie?.name,
          value: cookie?.value,
        });
      }
    }

    buttonSubmit.classList.remove('disabled')
    buttonSubmit.textContent = 'Tranfer Cookies'
    urlInputElement.value = ''
  }, 2000)
});

buttonReset.addEventListener("click", function () {
  buttonReset.classList.add('disabled')
  buttonReset.textContent = 'Loading...'

  setTimeout(() => {
    if(cookiesList.length > 0){
      for(let cookie of cookiesList){
        chrome.cookies.remove({
          url: currentUrl,
          name: cookie?.name,
        });
      }
    }

    buttonReset.classList.remove('disabled')
    buttonReset.textContent = 'Reset & Delete Cookies'
    urlInputElement.value = ''

    getActiveTab().then(showCookiesForTab);
  }, 2000)
});
