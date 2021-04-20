const router = require("express").Router();
const multer=require("multer");
const sharp=require("sharp");
const connection = require("../database/mysql-connection");
const jwt=require("jsonwebtoken");
const upload=multer({dest:'uploads/'
,limits:{
    fileSize:1000000
}
});




router.post("/api/edit-user",upload.single("avatarImage"),(req,res)=>{
    
    


    try {
        const verify=jwt.verify(req.body.authToken,process.env.SECRET_KEY);
        //validate username
        connection.query("UPDATE users SET avatar=? WHERE username=?",[req.file.filename,verify.username],(error,result,fields)=>{
            if(error) throw error;
            else{
                console.log("avatar has been updated");
            }
        })
       
    } catch (error) {
        console.log("couldn't verify the token auth in the user-edit page")
    }
    
    

})






module.exports=router;