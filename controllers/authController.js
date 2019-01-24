var Crypto = require('crypto');
const conn = require('../database');
const transporter = require('../helpers/pengirimEmail');
const { createJWTToken } = require('../helpers/jwt');

module.exports = {
    register: (req,res) => {
        var { username, password, email, phone } = req.body;
        var sql = `SELECT username FROM users WHERE username='${username}'`;
        conn.query(sql, (err, result) =>{
            if(err) {
                throw err;
            }

            if(result.length > 0){
                res.send({status: "error", message: "Username has been taken!"})
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
                        throw err1;
                    }

                    var linkVerifikasi = `http://localhost:3000/verified?username=${username}&password=${hash}`;
                    var mailOptions = {
                        from: 'No-Reply <fazlur.jamal@gmail.com>',
                        to : email,
                        subject : 'Email Verifikasi',
                        html: `Silahkan Klik Link Berikut Untuk Verifikasi: <a href="${linkVerifikasi}">Verifikasi Saya</a>`
                    }

                    transporter.sendMail(mailOptions, (err2, res2) => {
                        if(err2){
                            console.log(err2);
                            // res.send({status: 'Error!', message: 'Error sending message'})
                            throw res2;
                        } else {
                            console.log('Success!')
                            res.send({username, email, role: 'User', status: 'Unverified', token:''})
                        }
                    })

                })
            }
        })
    },
    signin: (req,res) => {

    },
    verified: (req,res) => {
        var { username, password } = req.body;
        var sql = `SELECT * FROM users WHERE
                    username='${username}' AND
                    password='${password}'`;
        
        conn.query(sql, (err, result) => {
            if(err) throw err;
            if(result.length > 0){
                sql = `UPDATE users SET status='Verified' WHERE id=${result[0].id}`;
                conn.query(sql, (err1,result1) => {
                    if(err1) throw err1;
                    
                    const token = createJWTToken({id: result[0].id});
                    res.send({
                        username, 
                        email: result[0].email,
                        role: result[0].role,
                        status: 'Verified',
                        token})
                })
            } else {
                throw 'User Not Exist';
            }
        })
    }
}