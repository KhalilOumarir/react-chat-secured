const router=require("express").Router();
const userValidators=require("../helpers/inputValidators");
const connection=require("../database/mysql-connection");
const {validationResult}=require("express-validator");
const crypto=require("crypto");
const jwt=require("jsonwebtoken");

//sign in logic
router.post("/sign-in",userValidators.validatePassword,
userValidators.validateEmail,(req,res)=>{
    //make the hash more secure later on
    const hash=crypto.createHmac("sha256","secret key");
    const hashedPassword=hash.update(req.body.password).digest("hex");
    

    const {password,email}=req.body;

    const errors=validationResult(req);
    const sentErrors={};
    if(!errors.isEmpty()){
        
        for(let error in errors.mapped()){
            sentErrors[error]=errors.mapped()[error].msg;
        }
        res.status(400).send(sentErrors);
    }else{
        //Login Using sql and JWT
        connection.query("SELECT * FROM users WHERE  email=?",[email],(error,results,fields)=>{
            if(error) console.log("there has been an error : ",error);
            else{
                if(hashedPassword===results[0].pass){
                    console.log("password matches");
                    const token=jwt.sign({username:results[0].username},process.env.SECRET_KEY,{expiresIn:3600});
                    return res.json({accessToken:token});
                }else{
                    console.log("password doesn't match.");
                }
            }
        })
    }
})








module.exports=router;