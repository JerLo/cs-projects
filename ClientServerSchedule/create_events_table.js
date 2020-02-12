var mysql = require("mysql");

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
    var sql = `CREATE TABLE tbl_events(event_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
                                       event_name VARCHAR(30),
                                       event_location VARCHAR(30),
                                       event_day VARCHAR(30),
                                       event_start_time VARCHAR(30),
                                       event_end_time VARCHAR(30))`; 
  con.query("DROP TABLE tbl_events", function(err, result) {
    if(err) {
      throw err;
    }
    console.log("Table created");
  });                                     
  
  con.query(sql, function(err, result) {
    if(err) {
      throw err;
    }
    console.log("Table created");
  });

  // inserts a default event in events table
  var rowToBeInserted = {
    event_id: 0,
    event_name: 'Sleep',
    event_location: 'Home',
    event_day: 'Monday',
    event_start_time: '10:00 pm',
    event_end_time: '8:00 am'
  };
  con.query('INSERT tbl_events SET ?', rowToBeInserted, function(err, result) {
    if(err) {
      throw err;
    }
    console.log("Values inserted");
  });
});
