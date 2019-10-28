let express = require("express")
let app = express()
let cookieParser = require("cookie-parser")
let multer = require("multer")
let upload = multer()

app.use(cookieParser())

let passwordAssoc = {}
let sessions = {}
let messages = []

app.use('/static', express.static(__dirname + '/public'))
app.get('/', (req, res) => {
    res.sendFile(__dirname + "/public/index.html")
})

app.post("/change/username", upload.none(), (req , res) => {
    let newName = req.body.newname

    console.log(newName)
    console.log(passwordAssoc[newName])

    if (passwordAssoc[newName] !== undefined)
    {
        return res.send("<html><body> user name has been taken</body></html>")
        
    }

    let username = sessions[req.cookies["sid"]]

    sessions[req.cookies["sid"]] = newName
    passwordAssoc[newName] = passwordAssoc[username]
    delete passwordAssoc[username]

    res.sendFile(__dirname + '/public/chat.html')
})
app.post("/messages", upload.none(), (req, res) => {
    console.log('POST message body', req.body)
    let newMessage = {
        user: sessions[req.cookies["sid"]],
        msg: req.body.message
    }
    messages.push(newMessage)
    res.sendFile(__dirname + '/public/chat.html')
})

app.get("/messages", (req , res) => {
    console.log('Sending back the messages')
    res.send(JSON.stringify(messages))
})

app.post("/signup", upload.none(), (req , res) => {
    let username = req.body.username
    let password = req.body.password
    passwordAssoc[username] = password
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
    sessions[sid] = username
    res.cookie('sid', sid)
    res.sendFile(__dirname + '/public/chat.html')
})
app.listen(4000)