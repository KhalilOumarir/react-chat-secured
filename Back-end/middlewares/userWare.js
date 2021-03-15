

module.exports={

    SessionAuthentication(req,res,next){
        if(!req.session.user){
            res.redirect("/");
        }else{
            next();
        }
    },
    RegisterAuthentication(req,res,next){
        if(req.session.user){
            res.redirect("/");
        }else{
            next();
        }
    }
    
  
    



}