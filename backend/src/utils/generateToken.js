const jwt = require("jsonwebtoken");
const env = require("../config/env");
const generateToken = (userid)=> {
    return jwt.sign({ 
        sub : userid,
    },
     env.jwtSecret, {
        expiresIn: "1d",
    });
    };
    module.exports = generateToken;