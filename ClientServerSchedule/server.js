
const http = require('http');
const url = require('url');
const fs = require('fs');
const qs = require('querystring');

http.createServer(function (req, res) {
  var q = url.parse(req.url, true);

  if(req.url === '/'){
      // default request
      indexPage(req,res);
  }
  else if(req.url === '/index.html'){
      //request for index page
      indexPage(req,res);
  }
  else if(req.url === '/schedule.html'){
      //request for schedule page
      schedule(req,res);
  }
  else if (req.url === '/stock.html') {
      //stock page request
      stockPage(req, res);
  }
  else if(req.url === '/addSchedule.html'){
      //form request
      addSchedule(req,res); 
  }
  else if(req.url === '/getSchedule'){
      //Ajax request from schedule page
      getSchedule(req,res);
  }
  // next route will get the data from the form and process it
  else if(req.url === '/postScheduleEntry') { 
        console.log("at postScheduleEntry")
        var reqBody = '';
        // server starts receiving the form data
        req.on('data', function(data) {
          reqBody += data;
        });
        console.log(reqBody);
        // server has received all the form data
        req.on('end', function() {
            addScheduleEntry(req, res, reqBody);
        });
  }
  else{
      res.writeHead(404, {'Content-Type': 'text/html'});
      return res.end("404 Not Found");
  }
}).listen(9001);


function indexPage(req, res) {
    console.log('getting index page');
    fs.readFile('client/index.html', function(err, html) {
        if(err) {
        throw err;
        }
        res.statusCode = 200;
        res.setHeader('Content-type', 'text/html');
        res.write(html);
        res.end();
  });
}

function stockPage(req, res) {
    console.log('getting stock page');
    fs.readFile('client/stock.html', function (err, html) {
        if (err) {
            throw err;
        }
        res.statusCode = 200;
        res.setHeader('Content-type', 'text/html');
        res.write(html);
        res.end();
    });
}

function schedule(req, res) {
  console.log('getting schedule page');
  fs.readFile('client/schedule.html', function(err, html) {
    if(err) {
      throw err;
    }
    res.statusCode = 200;
    res.setHeader('Content-type', 'text/html');
    res.write(html);
    res.end();
  });
}
function addSchedule(req, res) {
  console.log("getting addSchedule page");
  fs.readFile('client/addSchedule.html', function(err, html) {
    if(err) {
      throw err;
    }
    res.statusCode = 200;
    res.setHeader('Content-type', 'text/html');
    res.write(html);
    res.end();
  });
}
function getSchedule(req, res) {
  console.log("getting schedule JSON info");
  fs.readFile('schedule.json', function(err, data) {
    if(err) {
      throw err;
    }
    //console.log("Getting Schedule");
    res.statusCode = 200;
    res.setHeader('Content-type', 'application/json');
    res.write(data);
    res.end();
  });
  
}

function addScheduleEntry(req, res, reqBody) {
    console.log("adding schedule entry");
    var postInfo = qs.parse(reqBody);
    var jsonObj = {};
    jsonObj["eventName"] = postInfo.eventName;
    jsonObj["location"] = postInfo.location;
    jsonObj["date"] = postInfo.date;
    jsonObj["stime"] = postInfo.stime;
    jsonObj["etime"] = postInfo.etime;
    console.log(jsonObj);
    fs.readFile("schedule.json", function(err, content) {
        if(err) {
            throw err;
        }
        var sObj = JSON.parse(content);
        sObj["schedule"].push(jsonObj);
        fs.writeFile("schedule.json", JSON.stringify(sObj), function(err) {
            if(err) {
                throw(err);
            }
        });
        res.writeHead(302, {'location':'/schedule.html'});
        res.end();
    });
    
}
