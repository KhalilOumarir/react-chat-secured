// const mainRouter=require("./routers/mainRouter");
require('dotenv/config');
const bodyparser = require("body-parser");
const mongoose = require("mongoose");
const router = require("./routers/MessageRouter");
const cors = require("cors"); //learn more about cors and fix the issue where you need to use cors to be able to make api calls

const app = require("express")();

const server = app.listen(4000);

const io = require("socket.io")(server);

mongoose.connect(
    process.env.DB_CONNECTION,
    { useNewUrlParser: true, useUnifiedTopology: true }, () => console.log("Connected to DB"));

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://localhost:3000"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
app.use(bodyparser.json());
// app.use(mainRouter);
app.use(router);

app.use(cors());



io.on('connection', socket => {
    console.log("Client has been connected");
    let joinedRoom = "";


    socket.on("messageSent", (data) => {

        io.to(joinedRoom).emit("messageSent", data);

    })


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
})

