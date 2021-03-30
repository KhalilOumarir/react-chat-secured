// const mainRouter=require("./routers/mainRouter");
require('dotenv/config');
const bodyparser = require("body-parser");
const {validationResult}=require("express-validator");
const cors = require("cors"); //learn more about cors and fix the issue where you need to use cors to be able to make api calls



const router = require("./routers/MessageRouter");
const signUpRouter=require("./routers/sign-up-router");

const connection=require("./database/mysql-connection");
const signInRouter=require("./routers/sign-in-router");
const chatRouter=require("./routers/chat-router");


const app = require("express")();

connection.connect(()=>{
    console.log("connected");
});




// app.use(mainRouter);
app.use(bodyparser.json());
app.use(cors());
app.use(signUpRouter);
app.use(signInRouter);
app.use(chatRouter);







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