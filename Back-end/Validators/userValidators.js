const {body} = require("express-validator");
const userRepo = require("../repositories/userDB");
module.exports = {

    // these are registration checkers

    // check if the username exists in the db
    checkUsernameOnDB: body("username").trim().escape().isLength(
        {min: 3, max: 25}
    ).withMessage("username must be from 3 to 25 characters").custom(async (value) => {
        const userExists = await userRepo.getOneby({username: value});
        if (userExists) {
            throw new Error("There exists a user by that name.");
        }
    }),
    // check if the email exists in the db
    checkEmailOnDB: body("email").trim().escape().isEmail().custom(async (value) => {
        const userExists = await userRepo.getOneby({email: value});
        if (userExists) {
            throw new Error("Email already exists.");
        }
    }),
    checkSignupPasswordConditions: body("password").trim().escape().isLength(
        {min: 8, max: 50}
    ).withMessage("Password must be at least 8 characters long"),
    // check if the password passes the conditions


    // these are logging checkers


    // check if the password matches the one registered with
    // it als checks if the username exists in the db

    checkLoginPasswordConditions: body("password").trim().escape().isLength(
        {min: 8, max: 50}
    ).withMessage("Password must be at least 8 characters long").custom(async (value, {req}) => {
        const currentUserRecord = await userRepo.getOneby({username: req.body.username});

        if (currentUserRecord) {
            if (!(await userRepo.comparePasswords(currentUserRecord.password, value))) {
                throw new Error("Password is incorrect");
            }
        } else {
            throw new Error("Username doesn't exist");
        }
    }),
    checkUsernameLogin: body("username").trim().escape().isLength(
        {min: 3, max: 25}
    ).withMessage("Username must be from 3 to 25 characters")


}
