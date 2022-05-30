const mainBtn = document.getElementById("main-btn")
const finalMsg = document.getElementById("finalmsg")
let linkByTab = document.getElementById("link-inp")
const linkBtn = document.getElementById("link-btn")
const mainDiv = document.getElementById("main")
const credDiv = document.getElementById("creds")

function ToggleCredandMain(val) {
  if (val == "true") {
    credDiv.style.display = "none"
    mainDiv.style.display = "block"
  }
  else {
    credDiv.style.display = "block"
    mainDiv.style.display = "none"
  }
}

ToggleCredandMain(localStorage.getItem("toggle"))

const credSub = document.getElementById("cred-sub")
credSub.addEventListener("click", () => {
  
  const tokenID = document.getElementById("token-id").value
  const dbID = document.getElementById("db-id").value
  
  console.log(tokenID)
  console.log(dbID) 
  localStorage.setItem("notion_token", tokenID)
  localStorage.setItem("database_id", dbID)
  localStorage.setItem("toggle", true)

  ToggleCredandMain(localStorage.getItem("toggle"))
})



linkBtn.addEventListener("click", function () {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      linkByTab.value = tabs[0].url
      linkByTab.setAttribute('autofocus', 'autofocus')
    })
})

mainBtn.addEventListener("click", () => {

  const title = document.getElementById("name").value
  const comment = document.getElementById("comment").value
  const tag = document.getElementById("tag-inp").value
  const link = document.getElementById("link-inp").value

  
  action( link, tag, title, comment, localStorage.getItem("database_id") )

})

function action (link="", tag="untagged", name="", comment="", dataId) {

  let data = `
{
  "parent": {
    "database_id": "${dataId}"
  },
  "properties": {
    "title": {
      "title": [
        {
          "type": "text",
          "text": {
            "content": "${name}"
          }
        }
      ]
    },
    "pMiz": {
      "rich_text": [
        {
          "type": "text",
          "text": {
            "content": "${comment}"
          }
        }
      ]
    },
    "Ma%7Bx": {
      "url": "${link}"
    },
    "%3BzXD": {
      "multi_select": [
        {
          "name": "${tag}"
        }
      ]
    }
  }
}`
  
  sendRequest(data , final_token)

}

const notion_token_id = localStorage.getItem("notion_token")

const final_token = `Bearer ${notion_token_id}`
console.log(final_token)

function sendRequest (data, token) {

  var xhr = new XMLHttpRequest();
  xhr.withCredentials = true;

  xhr.addEventListener("readystatechange", function() {
    if(this.readyState === 4) {
      console.log(this.responseText);
      let response = JSON.parse(this.responseText);
        if (this.status === 200) {
          console.log('successful');
          finalMsg.innerText = "Added to your Notion List, Check!!!"

          const inputs = document.querySelectorAll('#name, #comment, #link-inp, #tag-inp');
          inputs.forEach(input => {
          input.value = '';
          });
        }
        else {
          console.log('failed');
        }
    }
  });
  

  xhr.open("POST", "https://api.notion.com/v1/pages");
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.setRequestHeader("Notion-Version", "2022-02-22");
  xhr.setRequestHeader("Authorization", token);
        
  xhr.send(data);

}

