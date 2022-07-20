// host, user, and password have been removed to ensure database security
const mysql = require('mysql2');
const pool = mysql.createPool({
    connectionLimit: 10,
    host: "",
    user: "",
    password: "",
    database: "ecommerce",
})

pool.on('acquire', function (connection) {
    console.log('Connection %d acquired', connection.threadId);
  });
  
  pool.on('connection', function (connection) {
    console.log('Connection %d connected', connection.threadId);
  });
  
  pool.on('enqueue', function () {
    console.log('Waiting for available connection slot');
  });
  
  pool.on('release', function (connection) {
    console.log('Connection %d released', connection.threadId);
  });
module.exports = pool;