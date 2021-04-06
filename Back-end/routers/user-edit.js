const router = require("express").Router();
const multer=require("multer");
const sharp=require("sharp");
const connection = require("../database/mysql-connection");
const jwt=require("jsonwebtoken");
const upload=multer({storage:multer.memoryStorage()});


router.post("/edit-user",upload.single("avatarImage"),(req,res)=>{
    try {
        const verify=jwt.verify(req.body.authToken,process.env.SECRET_KEY);
        //validate username
        sharp(req.file.buffer).resize(200,200).toBuffer((err,data,info)=>{
            if(err) console.log("there was an error in the sharp module");
            else{
                console.log(data);
                connection.query("UPDATE users SET avatar=? WHERE username=?",[data.toString("hex"),verify.username],(error,result,fields)=>{
                    if(error) throw error;
                    else{
                        console.log("avatar has been updated");
                    }
                })
            }
        })
    } catch (error) {
        console.log("couldn't verify the token auth in the user-edit page")
    }
    
    

})






module.exports=router;