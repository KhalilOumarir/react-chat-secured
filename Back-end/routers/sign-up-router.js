const signUpRouter=require("express").Router();


signUpRouter.post("/sign-up",(req,res)=>{
    console.log(req.body);

})


module.exports=signUpRouter;