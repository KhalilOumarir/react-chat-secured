// const mainRouter=require("./routers/mainRouter");
require('dotenv/config');
const bodyparser = require("body-parser");
const mysql=require("mysql");
const cors = require("cors"); //learn more about cors and fix the issue where you need to use cors to be able to make api calls



const router = require("./routers/MessageRouter");
const signUpRouter=require("./routers/sign-up-router");



const app = require("express")();

const connection=mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'password',
    database:'chat_app'
})


connection.connect(()=>{
    console.log("connected");
});


connection.query('SELECT 1+1 AS solution ',(err,result,fields)=>{
    if(err) throw err;
    console.log(result);
})


// app.use(mainRouter);
app.use(bodyparser.json());
app.use(cors());
app.use(router);





app.post("/sign-up",(req,res)=>{
    console.log(req.body);
    const data={username:req.body.username,
    email:req.body.email,
    pass:req.body.password}

    connection.query("INSERT INTO users SET ? ",data,(error,results,fields)=>{
        if(error) throw error
        console.log("user has been added");
    })
})
app.get("/",(req,res)=>{
    res.send({message:"connected"});
})




//socket based logic will be down here 

const server = app.listen(4000);

const io = require("socket.io")(server);



io.on('connection', socket => {
    console.log("Client has been connected");
    let joinedRoom = "";

    //on user send message 
    socket.on("messageSent", (data) => {

        io.to(joinedRoom).emit("messageSent", data);

    })

    //on user change room
    socket.on("change-room", ({ roomToJoin, roomToQuit }) => {

        if (roomToQuit) {
            socket.leave(roomToQuit);
        }
        if (roomToJoin) {
            joinedRoom = roomToJoin;
            socket.join(roomToJoin);
        }

        console.log("user just changed rooms to ", joinedRoom);
    })


    let usernames = [];
    //on user starts typing
    socket.on("user-is-typing", ({username}) => {
        const typingUser = usernames.find((user) => {
            return user === username
        });

        if (!typingUser) {

            usernames.push(username);
            socket.to(joinedRoom).emit("user-has-typed", usernames);
        }


    })

    //on user stopped typing
    socket.on("user-stopped-typing", ({username}) => {

        if (usernames.find(user => user === username)) {
            usernames = usernames.filter((user) => {
                return user !== username
            })
        }
        socket.to(joinedRoom).emit("user-has-typed", usernames);

    })

})