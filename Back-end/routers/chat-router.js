const router = require("express").Router();
const jwt = require("jsonwebtoken");
const connection = require("../database/mysql-connection");



//store message in the database
router.post("/chat",(req,res)=>{
    //check the user inputs and filter it
    const {message,fromUser,roomJoined}=req.body;
    console.log(req.body);
    try {
        const verified=jwt.verify(fromUser,process.env.SECRET_KEY);
        connection.query("INSERT INTO chat SET ? ",{from_user:verified.username,message,room_sent_to:roomJoined},
        (error,results,fields)=>{
            if(error) console.log("there has been an error while saving the message to the DB");
            else{
                console.log("message has been saved in the DB");
            }
        })
    } catch (error) {
        console.log("there was an error in verifiying jwt on message sent");
    }
})


router.get("/chat",(req,res)=>{
    
    const authToken=req.headers.authtoken.split(" "); // so we can get the authtoken differently
    
    if(authToken[1]){
        //if there is a token already, check it 
    
    try {
        const verified=jwt.verify(authToken[1],process.env.SECRET_KEY);
    } catch (error) {
        return res.status(400).send("Token has expired");
    }
    }else{
        //if there is no token, send a 400 status to  rediect to the sign-in page
        return res.status(400).send("No token available");
    }
    
})











module.exports=router;