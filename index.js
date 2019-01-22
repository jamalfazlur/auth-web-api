var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var mysql = require('mysql');
var Crypto = require('crypto');
var app = express();

var port = process.env.PORT || 1991;

app.use(bodyParser.json());
app.use(cors());

app.get('/', (req, res) => {
    res.send("<h2>Selamat datang di WEB-API</h2>")
})

app.get('/testencrypt', (req,res) => {
    const hash = Crypto.createHmac('sha256', "abcd123")
                   .update(req.query.password)
                   .digest('hex');
    console.log(hash);
    res.send(`Password Anda: ${req.query.password}
            <br>Telah di-Encrypt menjadi: <b>${hash}</b>`)
})

const { authRouter } = require('./routers')

app.use('/auth', authRouter)

app.listen(port, () => console.log(`Open API -> \n http://localhost:${port}`));