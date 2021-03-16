const mongoose=require("mongoose");

const MessageSchema=mongoose.Schema({
    message:{type:String,
    required:true
}
})

module.exports=mongoose.model("messages",MessageSchema);