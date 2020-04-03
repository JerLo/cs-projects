// include the express module
var express = require("express");

// create an express application
var app = express();

// helps in extracting the body portion of an incoming request stream
var bodyparser = require('body-parser');

// fs module - provides an API for interacting with the file system
var fs = require("fs");

// helps in managing user sessions
var session = require('express-session');

// hashes messages with the SHA-256 algorithm
var crypto = require('crypto');

// include the mysql module
var mysql = require("mysql");

// converts xml data to json format
var xml2js = require("xml2js");
var parser = new xml2js.Parser();
var xmlInfo;

fs.readFile(__dirname + '/dbconfig.xml', function(err, data) {
    if (err) throw err;
    console.log("data: \n" + data);
    parser.parseString(data, function (err, result) {
        if (err) throw err;
        console.log("The first item stored in the info record:\n" + result.dbconfig.host[0]);
        xmlInfo = result; 
    });
});

// apply the body-parser middleware to all incoming requests
app.use(bodyparser());

// use express-session
// in mremory session is sufficient
app.use(session({
  secret: "csci4131secretkey",
  saveUninitialized: true,
  resave: false}
));

var sess;

// server listens on port 9101 for incoming connections
app.listen(9101, () => console.log('Listening on port 9101!'));

app.get('/',function(req, res) {
	res.sendFile(__dirname + '/client/welcome.html');
});

// // GET method route for the events page.
// It serves schedule.html present in client folder
app.get('/schedule',function(req, res) {
  //Add Details
	sess = req.session;
    if(!sess.user) {
		console.log("Session not started, can't get schedule page");
		res.sendFile(__dirname + '/client/login.html');
	} else {
		console.log ("Directing to schedule.html");
		res.sendFile(__dirname + '/client/schedule.html');
    }
});

// GET method route for the addEvents page.
// It serves addSchedule.html present in client folder
app.get('/addSchedule',function(req, res) {
  sess = req.session;
    if(!sess.user) {
		console.log("Session not started, can't get addSchedule page");
		res.sendFile(__dirname + '/client/login.html');
	} else {
		console.log ("Directing to addSchedule.html");
		res.sendFile(__dirname + '/client/addSchedule.html');
    }
});

// GET method route for Admin page
// It serves admin.html present in client folder
app.get('/admin',function(req, res) {
    sess = req.session;
    if(!sess.user) {
        console.log("Session not started, can't get admin page");
        res.sendFile(__dirname + '/client/login.html');
    } else {
        console.log ("Directing to admin.html");
        res.sendFile(__dirname + '/client/admin.html');
    }
});

//GET method for stock page
// It serves client.html present in client folder
app.get('/stock', function (req, res) {
    sess = req.session;
    if(!sess.user) {
		console.log("Session not started, can't get stock page");
		res.sendFile(__dirname + '/client/login.html');
	} else {
		console.log ("Directing to stock.html");
		res.sendFile(__dirname + '/client/stock.html');
    }
});

// GET method route for the login page.
// It serves login.html present in client folder
app.get('/login',function(req, res) {
  //Add Details
  	sess = req.session;
	res.sendFile(__dirname + '/client/login.html');
    if(!sess.user) {
		console.log ("Directing to login.html");
		res.sendFile(__dirname + '/client/login.html');
	} else {
		console.log('Already logged in!');
		res.redirect("/schedule");
    }
});

// creates a JSON array that holds error flags and their truth values
var errObj = {};
errObj.delErr = false;
errObj.logErr = false;
errObj.postErr = false;
errObj.editErr = false;
// GET method to return array of error flags
app.get("/errorFlag", function(req, res) {
    res.setHeader('Content-type', 'application/json');
    res.write(JSON.stringify(errObj));
    res.end();
});

// GET method to return the list of events
// The function queries the events table for the list of places and sends the response back to client
app.get('/getListOfEvents', function(req, res) {
	sess = req.session;
    console.log("getting list of events");
    var con = mysql.createConnection({
        host: xmlInfo.dbconfig.host[0],
        user: xmlInfo.dbconfig.user[0],
        password: xmlInfo.dbconfig.password[0],
        database: xmlInfo.dbconfig.database[0],
        port: xmlInfo.dbconfig.port[0]
    });

    con.connect(function(err) {
        if (err) {
            throw err;
        };
        console.log("Connected!");
        con.query("SELECT * FROM tbl_events", function (err, result, fields) {
            console.log("Getting Schedule");
            var jsonObj = {};
            jsonObj["schedule"] = result; 
            res.statusCode = 200;
            res.setHeader('Content-type', 'application/json');
            res.write(JSON.stringify(jsonObj));
            res.end();
        }); 
    });
});

// GET method to return the list of users
// The function queries the accounts table for the list of users and sends the response back to client
app.get('/getListOfUsers', function(req, res) {
    sess = req.session;
    console.log("getting list of users");
    var con = mysql.createConnection({
        host: xmlInfo.dbconfig.host[0],
        user: xmlInfo.dbconfig.user[0],
        password: xmlInfo.dbconfig.password[0],
        database: xmlInfo.dbconfig.database[0],
        port: xmlInfo.dbconfig.port[0]
    });

    con.connect(function(err) {
        if (err) {
            throw err;
        };
        console.log("Connected!");
        con.query("SELECT * FROM tbl_accounts", function (err, result, fields) {
            console.log("Getting users");
            var jsonObj = {};
            jsonObj["users"] = result; 
            res.statusCode = 200;
            res.setHeader('Content-type', 'application/json');
            res.write(JSON.stringify(jsonObj));
            res.end();
        }); 
    });
});

// POST method to insert details of a new event to tbl_events table
app.post('/postEvent', function(req, res) {
  	var newEvent;
  	console.log("adding event to schedule");
  	sess = req.session;
	var con = mysql.createConnection({
        host: xmlInfo.dbconfig.host[0],
        user: xmlInfo.dbconfig.user[0],
        password: xmlInfo.dbconfig.password[0],
        database: xmlInfo.dbconfig.database[0],
        port: xmlInfo.dbconfig.port[0]
    });

    con.connect(function(err) {
    	if (err) {
    		throw err;
    	}
   		console.log("Connected!");
		var rowToBeInserted = {
			event_name: req.body.eventName,
			event_location: req.body.location,
			event_day: req.body.date,
			event_start_time: req.body.stime,
			event_end_time: req.body.etime
		};

    	con.query("INSERT INTO tbl_events SET ?", rowToBeInserted, function(err, result) {
    		if (err) {
    			throw err;
    		}
    		console.log("value inserted");
    	});
    });
    res.redirect("/schedule")
});

// POST method to insert details of a new user to tbl_accounts table
app.post('/postUser', function(req, res) {
    console.log("adding user to acc table");
    sess = req.session;
    if(!req.session.user) {
        res.redirect("/login");
    }
    var con = mysql.createConnection({
        host: xmlInfo.dbconfig.host[0],
        user: xmlInfo.dbconfig.user[0],
        password: xmlInfo.dbconfig.password[0],
        database: xmlInfo.dbconfig.database[0],
        port: xmlInfo.dbconfig.port[0]
    });

    con.connect(function(err) {
        if (err) {
            throw err;
        }
        console.log("Connected!");
        var errExists = {};
        errExists.flag = false;
        con.query("SELECT acc_login FROM tbl_accounts ", function(err, result) {
            if (err) {
                throw err;
            }
            console.log("login info");
            console.log(result[0].acc_login);
            console.log(req.body.accLogin);
            for(var i = 0; i<result.length; i++) {
                if(result[i].acc_login == req.body.accLogin) {
                    errExists.flag = true;
                    break;
                }
            }
            validate(errExists.flag);
        });

        function validate(val) {
            console.log(val);
            if(!val) {
                var rowToBeInserted = {
                    acc_name: req.body.accName,
                    acc_login: req.body.accLogin,
                    acc_password: crypto.createHash('sha256').update(req.body.accPassword).digest('base64'),
                };
                con.query("INSERT INTO tbl_accounts SET ?", rowToBeInserted, function(err, result) {
                    if (err) {
                        throw err;
                    }
                    console.log("Post Successful!");
                    errObj.delErr = false;
                    errObj.postErr = false;
                    errObj.editErr = false;
                });
            }
            else {
                console.log("User with login already exists!");
                errObj.postErr = true;
                errObj.editErr = false;
                errObj.delErr = false;
            }
            res.redirect("/admin");
        }
    });
});

// POST method to update details of an existing user to tbl_accounts table
app.post('/updateUser', function(req, res) {
    console.log("preparing to update user");
    sess = req.session;
    if(!req.session.user) {
        res.redirect("/login");
    }
    var con = mysql.createConnection({
        host: xmlInfo.dbconfig.host[0],
        user: xmlInfo.dbconfig.user[0],
        password: xmlInfo.dbconfig.password[0],
        database: xmlInfo.dbconfig.database[0],
        port: xmlInfo.dbconfig.port[0]
    });

    con.connect(function(err) {
        if (err) {
            throw err;
        }
        console.log("Connected!");
        var errExists = {};
        errExists.flag = false;
        con.query("SELECT acc_login FROM tbl_accounts ", function(err, result) {
            if (err) {
                throw err;
            }
            console.log("login info");
            console.log(result[0].acc_login);
            console.log(req.body.newLogin);
            for(var i = 0; i<result.length; i++) {
                if(result[i].acc_login == req.body.newLogin) {
                    errExists.flag = true;
                    break;
                }
            }
            validate(errExists.flag);
        });

        function validate(val) {
            console.log(val);
            if(!val) {
                var rowToBeUpdated = [req.body.newName, req.body.newLogin, crypto.createHash('sha256').update(req.body.newPass).digest('base64'), req.body.oldLogin];
                var sql = "UPDATE tbl_accounts SET acc_name = ?," 
                + " acc_login = ?, acc_password = ? WHERE acc_login = ?";

                con.query(sql, rowToBeUpdated, function(err, result) {
                    if (err) {
                        throw err;
                    }
                    console.log("Update Successful!");
                    errObj.delErr = false;
                    errObj.postErr = false;
                    errObj.editErr = false;
                });
            }
            else {
                console.log("Login is used by another user!");
                errObj.editErr = true;
                errObj.delErr = false;
                errObj.postErr = false;
            }
        }
    });

});

// POST method to validate user login
// upon successful login, user session is created
app.post('/sendLoginDetails', function(req, res) {
    console.log("validating username and password");
    sess = req.session;
    var con = mysql.createConnection({
        host: xmlInfo.dbconfig.host[0],
        user: xmlInfo.dbconfig.user[0],
        password: xmlInfo.dbconfig.password[0],
        database: xmlInfo.dbconfig.database[0],
        port: xmlInfo.dbconfig.port[0]
    });

    con.connect(function(err) {
        if (err) {
            throw err;
        };
        console.log("Connected!");
        con.query("SELECT acc_login,acc_password FROM tbl_accounts", function (err, result, fields) {
            var data_pass = result[0]["acc_password"];
    		var form_pass = crypto.createHash('sha256').update(req.body.password).digest('base64');
    		var data_user = req.body.username
    		var form_user = result[0]["acc_login"];
    		if(!result.length) {
    			res.redirect('/login');
    		}
            if(form_user == data_user && data_pass == form_pass) {
                console.log("Validation successful!");
                sess.user = form_user
                res.redirect('/schedule');
            }
            else {
                console.log("Validation unsuccessful!");
                res.redirect("/login");
            }
        });
    });
});

// POST method to delete details of an existing user from tbl_accounts table
app.post('/deleteUser', function(req, res) {
    console.log("preparing to delete user");
    sess = req.session;
    if(!req.session.user) {
    	res.redirect("/login");
    }
    var acctLogin = req.body.tdLogin;
    if(acctLogin != req.session.user) {
    	var con = mysql.createConnection({
            host: xmlInfo.dbconfig.host[0],
            user: xmlInfo.dbconfig.user[0],
            password: xmlInfo.dbconfig.password[0],
            database: xmlInfo.dbconfig.database[0],
            port: xmlInfo.dbconfig.port[0]
        });
    	con.connect(function(err) {
        	if (err) {
            	throw err;
        	};
        	console.log("Connected!");
        	console.log(req.body.tdLogin);
        	con.query("DELETE FROM tbl_accounts WHERE acc_login = ?", req.body.tdLogin, function (err, result, fields) {
            	console.log("Deletion Successful!");
                errObj.delErr = false;
                errObj.postErr = false;
                errObj.editErr = false;
        	});
    	});
	}
	else {
        console.log("Cannot delete a user that is logged in!");
        errObj.delErr = true;
        errObj.postErr = false;
        errObj.editErr = false;
	}
    res.redirect("/admin");
});

// log out of the application
// destroy user session
app.get('/logout', function(req, res) {
    //Add details
    sess = req.session;
	if(!sess.user) {
		res.send('Session not started, can not logout!');
	} else {	
		sess.destroy();
		console.log ("Successfully Destroyed Session!");
		res.redirect("/login");
	}
});

// middle ware to serve static files
app.use('/client', express.static(__dirname + '/client'));


// function to return the 404 message and error to client
app.get('*', function(req, res) {
  // add details
  res.sendFile(__dirname + '/client/404.html');
});
