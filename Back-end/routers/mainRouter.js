const express = require("express");
const nsData = require("../data/nsData");
const userRepo = require("../repositories/userDB");
const { validationResult } = require("express-validator");
const sessionRepo = require("../repositories/sessions");
const router = express.Router();



const {
    checkEmailOnDB,
    checkUsernameOnDB,
    checkSignupPasswordConditions,
    checkLoginPasswordConditions,
    checkUsernameLogin
} = require("../Validators/userValidators");
const { SessionAuthentication, RegisterAuthentication } = require("../middlewares/userWare");

router.get("/chat", SessionAuthentication, async(req, res) => {
    let namespaces;
    nsData().then((result) => {
        return res.render("chat", {
            namespaces: result,
            username: req.session.user
        })
    })


})


router.get("/", ((req, res, next) => {
    if (req.session.user) {
        res.redirect("/chat");
    } else {
        next();
    }
}), async(req, res) => {

    res.render("index", { errors: 0 });
})
router.post("/", [
    checkLoginPasswordConditions, checkUsernameLogin
], async(req, res) => {
    const { username } = req.body;
    const errors = validationResult(req);

    if (errors.isEmpty()) {
        req.session.user = username;
        res.redirect("/chat");
    } else {

        return res.render("index", { errors });
    }


})

router.get("/session", async(req, res) => {

    req.session = null;
    res.redirect("/chat");
})


router.get("/Sign-up", RegisterAuthentication, (req, res) => {
    //check if there is a session , if there is then direct him to the chat directly

    res.render("Sign-up", { errors: 0 });
})

router.post("/Sign-up", [
    checkEmailOnDB, checkUsernameOnDB, checkSignupPasswordConditions
], async(req, res) => {
    const errors = validationResult(req);
    const { username, email, password } = req.body;
    if (errors.isEmpty()) {
        await userRepo.create({ username, email, password })
    } else { // display errors

        return res.render("Sign-up", { errors });
    }
    return res.redirect("/");

})


router.get("/admin", async(req, res) => {
    const namespaces = await sessionRepo.getAllNamespaces();
    console.log(namespaces);
    res.render("admin-page", { namespaces });

})

router.post("/admin", async(req, res) => {
    const { namespace } = req.body;
    //this logic allows us to get only the rooms that has been filled in and their length is longer than 2 characters
    const roomsArray = [];
    const keys = Object.keys(req.body);
    const values = Object.values(req.body);
    if (keys && values) {
        if (keys.length >= 2) {

            for (let i = 1; i < (keys.length); i++) {
                const roomName = values[i];
                if (roomName.length > 2) {
                    roomsArray.push(roomName);
                }
            }
        } else if (keys.length < 2) {
            return res.send("you must have at least one room in a namespace");
        }
    } else {
        return res.send("namespace and rooms are empty,you must at least fill a namespace");
    }

    const NSdetails = {
        NsTitle: namespace,
        Rooms: roomsArray
    }

    await sessionRepo.addNamespace(NSdetails);


    return res.redirect("/admin");
})


module.exports = router;