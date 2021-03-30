const {body} = require("express-validator");

module.exports={
    //making sure the data is in the right format
    validateUsername: body("username").trim().escape().isLength(
        {min: 3, max: 20}
    ).withMessage("Username must be between 3 and 25 characters"),
    validatePassword: body("password").trim().escape().isLength(
        {min: 5, max: 50}
    ).withMessage("Username must be between 5 and 50 characters"),
    validateEmail: body("email").trim().escape().isEmail().withMessage("Email must be valid")
}