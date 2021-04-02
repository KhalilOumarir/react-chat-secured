// const mainRouter=require("./routers/mainRouter");
require('dotenv/config');
const bodyparser = require("body-parser");
const {validationResult}=require("express-validator");
const cors = require("cors"); //learn more about cors and fix the issue where you need to use cors to be able to make api calls
const jwt=require("jsonwebtoken");


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

io.use((socket,next)=>{
    
    try {
        const verify=jwt.verify(socket.handshake.query.authToken,process.env.SECRET_KEY);
        next();
    } catch (error) {
        console.log("can't access the chat because user isn't signed in , aka invalid Token");
    }
})

io.on('connection', socket => {
    console.log("Client has been connected");
    let joinedRoom = "";
    let username="";
    try {
        const verified=jwt.verify(socket.handshake.query.authToken,process.env.SECRET_KEY);
        username=verified.username;
    } catch (error) {
        
    }
    //on user send message 
    socket.on("messageSent", (data) => {

        io.to(joinedRoom).emit("messageSent", data);

    })

    //on user change room
    socket.on("change-room", ({ roomToJoin, roomToQuit}) => {
       //sends an emit to all the users in a room with an update of the current users in session that is in that room
        if (roomToQuit) {
            socket.leave(roomToQuit);
        }
        if (roomToJoin) {
            joinedRoom = roomToJoin;
            socket.join(roomToJoin);
            //validate the rooms before you make em join , also the username
            //get the user that is in the previous room , and assign him to the nw room
            connection.query(`SELECT * FROM sessions WHERE user_in_session='${username}'`,
            (error,results,fields)=>{
                if(error){
                    
                    
                } 
                else{
                    if(!results.length){
                        console.log(username);
                        console.log("there isn't a user with this name in the sessions DB,so we'll add one ");
                        connection.query("INSERT INTO sessions SET ? ",{user_in_session:username,room_inside:roomToJoin},
                        (errors,result,field)=>{
                            if(errors) console.log("couldn't add user in the sessions DB");
                            else{
                                console.log("user added to the sessions DB");
                            }
                        })
                    }else{
                        console.log("found user in the sessions db");
                        //if user found , change the room he is in
                        connection.query("UPDATE sessions SET room_inside=? WHERE user_in_session=?",[roomToJoin,username],
                        (errors,result,field)=>{
                            if(errors) console.log("Couldn't modify the room that the user is in ");
                            else{
                                console.log("the room that the user is in has been updated");
                            }
                        })
                    }
                   
                }
            })
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


    socket.on("disconnect",()=>{
        //things to do on disconnect
        //remove user from sessions DB
        
        connection.query("DELETE FROM sessions WHERE user_in_session=?",[username],(error,results,fields)=>{
            if(error) console.log("error while trying to delete the user from sessions DB");
            else{
                console.log("user has been deleted from the sessions DB ");
            }
        })
    })

})