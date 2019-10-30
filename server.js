let express = require("express")
let app = express()
let cookieParser = require("cookie-parser")
let multer = require("multer")
let upload = multer({
    dest: __dirname + '/public/images',
})

app.use(cookieParser())

let passwordAssoc = {}
let sessions = {}
let messages = []
let users = {}

app.use('/static', express.static(__dirname + '/public'))
app.get('/', (req, res) => {
    res.sendFile(__dirname + "/public/index.html")
})

app.post("/topic", upload.none(), (req, res) => {
    let topic = req.body.topic;
    

})

app.post("/ignore", upload.none(), (req, res) => {
    let uignore = req.body.uignore;
    let user = sessions[req.cookies['sid']];
    
    user.uignore.push(uignore);

    res.sendFile(__dirname + '/public/chat.html');
})
app.post("/setred", upload.none(), (req , res) => {
    let user = sessions[req.cookies["sid"]];
    user.color = 'red';

    res.sendFile(__dirname + '/public/chat.html');
})

app.post("/change/username", upload.none(), (req , res) => {
    let newName = req.body.newname
    let user = sessions[req.cookies["sid"]]
   
    if (passwordAssoc[newName] !== undefined)
    {
        return res.send("<html><body> user name has been taken</body></html>")        
    }

    users[newName] = user;    
    passwordAssoc[newName] = passwordAssoc[user.username]
    delete passwordAssoc[user.username]
    delete users[user.username];
    user.username = newName;
    sessions[req.cookies["sid"]] = user;

    res.sendFile(__dirname + '/public/chat.html')
})
app.post("/messages", upload.single('msg-img'), (req, res) => {
    console.log('POST message body', req.body)
    const sessionId = req.cookies['sid'];
    const user = sessions[sessionId];
    const file = req.file;
    console.log(file)
    if (user === undefined) {
        return res.redirect('/');
    }

    let newMessage = {
        user: user,
        msg: req.body.message,
        imgPath: '/static/images/' + file.filename,        
    }
    console.log(newMessage.imgPath)
    messages.push(newMessage)
    res.sendFile(__dirname + '/public/chat.html')
})

app.get("/messages", (req , res) => {
    console.log('Sending back the messages')
    let user = sessions[req.cookies['sid']];
    let users_ignore = user.uignore
    // this is to be implemented in the server end, to know the users whose message current user would like to ignore.
    // filter out the messages from those users.  
    let cur_message = messages.filter((msg) => { 
        return users_ignore.every((currentValue) => { return currentValue !== msg.user.username })
    })
    res.send(JSON.stringify(cur_message))
    // res.send(JSON.stringify(messages))
})

app.post("/signup", upload.none(), (req , res) => {
    let username = req.body.username
    let password = req.body.password
    passwordAssoc[username] = password
    users[username] = {
        username : username,
        color: 'black',       
        uignore: [], 
    }
    res.send("<html><body> signup successful </body></html>")
})

app.post("/login", upload.none(), (req, res)=>{
    let username = req.body.username
    let passwordGiven = req.body.password
    let expectedPassword = passwordAssoc[username]
    console.log(expectedPassword);
    console.log(passwordGiven);

    if(expectedPassword !== passwordGiven) {
        res.send("<html><body> invalide username or password </body></html>")
        return
    }
    let sid = Math.floor(Math.random()* 10000000)
    sessions[sid] = users[username]
    res.cookie('sid', sid)
    res.sendFile(__dirname + '/public/chat.html')
})
app.listen(4000)