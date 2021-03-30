const router = require("express").Router();
const jwt = require("jsonwebtoken");



//store message in the database
router.post("/chat",(req,res)=>{
    console.log(req.body);
})


router.get("/chat",(req,res)=>{
    
    const authToken=req.headers.authtoken.split(" "); // so we can get the authtoken differently
    
    if(authToken[1]){
        //if there is a token already, check it 
    
    try {
        const verified=jwt.verify(authToken[1],"this is a secret key");
    } catch (error) {
        return res.status(400).send("Token has expired");
    }
    }else{
        //if there is no token, send a 400 status to  rediect to the sign-in page
        return res.status(400).send("No token available");
    }
    
})











module.exports=router;