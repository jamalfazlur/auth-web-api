const jwt = require('jsonwebtoken');

module.exports = {
    createJWTToken(payload){
        return jwt.sign(payload, "Tes123", {expiresIn: '12h'})
    }
}