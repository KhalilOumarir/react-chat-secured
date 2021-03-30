const signUpRouter=require("express").Router();
const userValidators=require("../helpers/inputValidators");
const {validationResult}=require("express-validator");
const crypto=require("crypto");
const connection=require("../database/mysql-connection");




signUpRouter.post("/sign-up",userValidators.validateEmail,
userValidators.validateUsername,
userValidators.validatePassword,(req,res)=>{
       
    //make the hash more secure later on
    const hash=crypto.createHmac("sha256","secret key");
    const errors=validationResult(req);
    const hashedPassword=hash.update(req.body.password).digest("hex");
    const data={username:req.body.username,
    email:req.body.email,
    pass:hashedPassword}


    connection.query( `SELECT * FROM users WHERE username="${req.body.username}" OR email="${req.body.email}"`,
    (error,results,fields)=>{
        if(error) console.log("error has occured : ",error);
        else {
            if(results.length){
                res.status(400).send({other:"User or email already exists."});
                return
            }
        }
        
    })
    

    if(errors.isEmpty()){
        connection.query("INSERT INTO users SET ? ",data,(error,results,fields)=>{
            if(error) console.log("user has not been added , an error occured.");
            else{console.log("user has been added");
             res.status(200).send("You have successfully been registered");
             return
            }
        })
    }
    else{
        const sentErrors={};
        for(let error in errors.mapped()){
            sentErrors[error]=errors.mapped()[error].msg;
        }
        console.log("there are some errors");
        res.status(400).send(sentErrors);
        return
    }
    
})


module.exports=signUpRouter;