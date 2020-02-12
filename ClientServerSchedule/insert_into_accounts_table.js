var mysql = require("mysql");
var crypto = require('crypto');

var con = mysql.createConnection({
  host: "cse-curly.cse.umn.edu",
  user: "C4131S19G72",
  password: "5214",
  database: "C4131S19G72",
  port: 3306
});

con.connect(function(err) {
  if (err) {
    throw err;
  };
  console.log("Connected!");

  // creates a default account with login credentials
  // password is hashed with the SHA-256 algorithm
  var rowToBeInserted = {
    acc_name: 'lopez703',
    acc_login: 'admin',
    acc_password: crypto.createHash('sha256').update("admin").digest('base64')
  }; 

  con.query('INSERT tbl_accounts SET ?', rowToBeInserted, function(err, result) {
    if(err) {
      throw err;
    }
    console.log("Value inserted");
  });
});
