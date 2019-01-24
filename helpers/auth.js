const jwt = require('jsonwebtoken');

// var config = require('../config.js')
module.exports = { 
    auth : (req, res, next) => {
            if(req.method !== "OPTIONS") {
                // console.log(req)
                jwt.verify(req.token, "Tes123", (error, decoded) =>  {
                    if(error) {
                        throw 'User Not Authorize!';
                    }
                    // console.log(decoded);
                    req.user = decoded;
                    next();
                });
            } else {
                next();
            }
        }
}
    