var Crypto = require('crypto');
const conn = require('../database');
const transporter = require('../helpers/pengirimEmail');

module.exports = {
    register: (req,res) => {
        var { username, password, email, phone } = req.body;
        var sql = `SELECT username FROM users WHERE username='${username}'`;
        conn.query(sql, (err, result) =>{
            if(err) {
                res.send({status: "Error", message: "System Error"})
                res.end();
            }

            if(result.length > 0){
                res.send({status: "Error", message: "Username has been taken!"})
            } else {
                const hash = Crypto.createHmac('sha256', "abcd123")
                            .update(password).digest('hex');
                var dataUser = { 
                    username,
                    password: hash,
                    email,
                    phone,
                    role: 'User',
                    status: 'Unverified',
                    lastlogin: new Date() 
                }
                sql = `INSERT INTO users SET ?`;
                conn.query(sql, dataUser, (err1, result1) => {
                    if(err1){
                        res.send({status: "Error", message: "System Error"})
                        res.end();
                    }

                    var linkVerifikasi = ``;
                    var mailOptions = {
                        from: 'No-Reply <fazlur.jamal@gmail.com>',
                        to : email,
                        subject : 'Email Verifikasi',
                        html: `Silahkan Klik Link Berikut Untuk Verifikasi: ${linkVerifikasi}`
                    }

                    transporter.sendMail(mailOptions, (err, res1) => {
                        if(err){
                            console.log(err);
                            res.send({status: 'Error!'})
                        } else {
                            console.log('Success!')
                            res.send({status: 'Success!'})
                        }
                    })

                })
            }
        })
    },
    signin: (req,res) => {

    }
}