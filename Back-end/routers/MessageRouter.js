const router = require("express").Router();
const MessageSchema = require("../models/MessageSchema");


router.post("/api/chat", async (req, res) => {
    const newMsg = new MessageSchema({
        message: req.body.message
    });

    try {
        const result = await newMsg.save();
        console.log(result);
        console.log("item has been added to the database.")
    } catch (error) {
        console.log("There has been an error in adding the item.");
        console.log(error);
    }
    
})


module.exports = router;