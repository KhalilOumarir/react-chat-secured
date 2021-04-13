const connection = require("../database/mysql-connection");
const validator=require("validator");

const getUsersOnline = (io) => {
    //sends an emit to all the users in a room with an update of the current users in session that is in that room
    connection.query(`SELECT COUNT(room_inside) AS users_in_room,room_inside AS rooms FROM sessions GROUP BY room_inside`, (errors, results, fields) => {
        if (errors) console.log("there was an error when trying to fetch all the users that are connected to a room ", errors)
        else {
            
            // if(results.length){
            //     io.to(roomToQuit).emit("users-online",results[0].users_in_room);
            //     io.to(roomToJoin).emit("users-online",results[0].users_in_room);
            // }
            for (let result of results) {
                console.log(result);
                io.to(result.rooms).emit(`users-online-${result.rooms}`, result.users_in_room);
            }
        }
    })
}


//this function handles when the user isn't online and just joined the chat
const addUserToDBSession=(roomToJoin,username,io)=>{
    console.log(username);
    console.log("there isn't a user with this name in the sessions DB,so we'll add one ");
    connection.query("INSERT INTO sessions SET ? ",{user_in_session:username,room_inside:roomToJoin},
    (errors,result,field)=>{
        if(errors) console.log("couldn't add user in the sessions DB");
        else{
            console.log("user added to the sessions DB");
            getUsersOnline(io)
        }
    })
}


//this function handles when the user is already online but changed the room
const updateExistingUserSession=(roomToJoin,username,io)=>{
    console.log("found user in the sessions db");
    //if user found , change the room he is in
    connection.query("UPDATE sessions SET room_inside=? WHERE user_in_session=?",[roomToJoin,username],
    (errors,result,field)=>{
        if(errors) console.log("Couldn't modify the room that the user is in ");
        else{
            console.log("the room that the user is in has been updated");
            getUsersOnline(io);
        }
    })
}


const showRandomOnlineUsers=(io,joinedRoom)=>{
    const sanitize=data=>{
        return validator.escape(data);
    }
    
    connection.query("SELECT user_in_session AS username from sessions where room_inside=? LIMIT 4",[sanitize(joinedRoom)],(error,results,fields)=>{
        if(error) console.log("Couldn't fetch users in the chat room");
        else{
            console.log(results);
            const data=[]
            if(results.length){
                for (let result of results){
                    data.push(result.username)
                }
            }
            io.to(sanitize(joinedRoom)).emit("random-online-users",data);
        }
    })
}




// export {updateExistingUserSession,getUsersOnline,addUserToDBSession}

module.exports={
    updateExistingUserSession,
    getUsersOnline,
    addUserToDBSession,
    showRandomOnlineUsers
}