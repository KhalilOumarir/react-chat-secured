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
const userEditRouter=require("./routers/user-edit");
const {addUserToDBSession,updateExistingUserSession,getUsersOnline} = require("./helpers/sql-helpers");

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
app.use(userEditRouter);






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
    //show 4 random users in the room
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
        
        io.to(joinedRoom).emit("messageSent", {message:data,username:username});

    })

    //on user change room
    socket.on("change-room", ({ roomToJoin, roomToQuit}) => {
        
       
        if(roomToJoin!==joinedRoom){
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
                        console.log("error in getting the user in session , in sessions DB")
                    } 
                    else{
                        if(!results.length){
                            addUserToDBSession(roomToJoin,username,io);
                        }else{
                            updateExistingUserSession(roomToJoin,username,io);
                        }
                       
                    }
                })
                
                //display all the 50 last messages from the database to the front-end(but now its all the messages)
                connection.query("SELECT from_user,message FROM chat WHERE room_sent_to=?",[joinedRoom],(errors,results,fields)=>{
                    if(errors) console.log("Couldn't fetch the messages in the room: ",joinedRoom);
                    else{
                        const data=[];
                        //send the messages to the front-end
                        if(results.length){
                            //send an array of messages in one call
                            
                            
                            for(let result of results){
                                data.push({message:result.message,username:result.from_user});
                                
                            }
                            
                            
                        }
                        io.to(joinedRoom).emit("previous-messages",data)
                    }
                })
            }
        }
       

      
        
        console.log("user just changed rooms to ", joinedRoom);
    })


    let usernames = [];
    //on user starts typing
    socket.on("user-is-typing", ({usernameToken}) => {

        try {
            let username=jwt.verify(usernameToken,process.env.SECRET_KEY).username;
            const typingUser = usernames.find((user) => {
                return user === username
            });
    
            if (!typingUser) {
    
                usernames.push(username);
                socket.to(joinedRoom).emit("user-has-typed", usernames);
            }
        } catch (error) {
            console.log("User isn't signed in , so he can't be displayed typing");
        } 
      


    })

    //on user stopped typing
    socket.on("user-stopped-typing", ({usernameToken}) => {
        try {
            let username=jwt.verify(usernameToken,process.env.SECRET_KEY).username;
            if (usernames.find(user => user === username)) {
                usernames = usernames.filter((user) => {
                    return user !== username
                })
            }
            socket.to(joinedRoom).emit("user-has-typed", usernames);
        } catch (error) {
            console.log("User isn't signed in , so he can't be displayed typing");
        }
        

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