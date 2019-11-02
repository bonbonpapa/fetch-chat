let topic = document.getElementById("topic");
// let body = document.body;

let fetchAndUpdate = async () => {
  let response = await fetch("/messages");
  let responseBody = await response.text();
  let parsed = JSON.parse(responseBody);
  let msgListUL = document.getElementById("msg-list");
  msgListUL.innerHTML = "";
  parsed.forEach(elem => {
    let li = document.createElement("li");
    li.innerHTML = `<span style="color:${elem.user.color}">${elem.user.username}</span>: ${elem.msg} <div><img src="${elem.imgPath}" /></div>`;
    msgListUL.append(li);
  });

  response = await fetch("/topic");
  responseBody = await response.text();
  let partopic = JSON.parse(responseBody);
  let topic = document.getElementById("topic");
  topic.innerText = partopic;

  response = await fetch("/activeuser");
  responseBody = await response.text();
  let parsedUsers = JSON.parse(responseBody);

  let activeuserList = document.getElementById("user-list");
  activeuserList.innerHTML = "";
  Object.values(parsedUsers).forEach(elem => {
    let timenow = new Date();
    if (elem.timeLastMessage !== undefined) {
      let timeMessage = new Date(elem.timeLastMessage);
      let timediff = timenow - timeMessage;

      if (Math.round(timediff / 1000 / 60) < 5) {
        let li = document.createElement("li");
        li.innerHTML = elem.username + "  " + elem.timeLastMessage;
        activeuserList.append(li);
      }
    }
  }); 
};
fetchAndUpdate();
setInterval(fetchAndUpdate, 5000);


let formUpdate = () => {
  let theForm = document.getElementById("message-form");
  theForm.addEventListener('submit', ev => {
  ev.preventDefault();
  let messageInput = document.getElementById("message-input");
  let imgPath = document.getElementById('msgimg');
  let data = new FormData();
  data.append("message", messageInput.value);
 data.append("imgPath", imgPath.files[0]);

 console.log(data);

  fetch("/messages", {method:"POST", credentials: "same-origin", body: data});

})

};

formUpdate();

