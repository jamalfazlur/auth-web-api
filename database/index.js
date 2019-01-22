const mysql = require('mysql');

const conn = mysql.createConnection({
    host: 'db4free.net',
    user: 'jamalnew',
    password: 'bismillah114',
    database: 'tutuplapak',
    port: 3306
});

module.exports = conn;