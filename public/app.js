let fetchAndUpdate = async () => {
    let response = await fetch('/messages')
    let responseBody = await response.text()
    let parsed = JSON.parse(responseBody)
    let msgListUL = document.getElementById('msg-list')
    msgListUL.innerHTML = ""
    parsed.forEach(elem => { 
        let li = document.createElement("li")
        li.innerHTML = `<span style="color:${elem.user.color}">${elem.user.username}</span>: ${elem.msg} <div><img src="${elem.imgPath}" /></div>`
        msgListUL.append(li)        
        
    });
}
fetchAndUpdate()
setInterval(fetchAndUpdate,500)