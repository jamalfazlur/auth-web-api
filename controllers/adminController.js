const conn = require('../database');

module.exports = {
    getuserlist: (req,res) => {
        // res.send(req.user.id);
        // return res.status(200).json({idUser: req.user.id})
        return res.sendStatus(200);
    }
}