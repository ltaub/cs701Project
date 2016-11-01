var http = require('http');
var fs = require('fs');
var formidable = require("formidable");
var util = require('util');
//var window = require('WindowTimers');
var file = "test1.db";
var exists = fs.existsSync(file);
console.log(exists);

if(!exists) {
  console.log("Creating DB file.");
  fs.openSync(file, "w");
}

var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database(file);
//db.run('CREATE TABLE user2 (name TEXT, id INT)');/*class1 TEXT, class_type1 TEXT, class_day1 TEXT, class_start1 TEXT, class_end1 TEXT)');*/
//how do i change this so i can create a new databse table for each user
//and how do i check to see if the user already exists so I can just update their table

var server = http.createServer(function(req,res){
  if(req.method.toLowerCase() == 'get'){
    displayForm(res);
  }else if (req.method.toLowerCase() == 'post'){
    processFormFieldsIndividual(req,res);
  }

});
function displayForm(res) {
    fs.readFile('test.html', function (err, data) {
        res.writeHead(200, {
            'Content-Type': 'text/html',
                'Content-Length': data.length
        });
        res.write(data);
        res.end();
    });
}

/*CITATION*/
function processFormFieldsIndividual(req, res, fields) {
    //Store the data from the fields in your data store.
    //The data store could be a file or database or any other store based
    //on your application.
    var fields = [];
    var field_names = [];
    var num = 0;
    var form = new formidable.IncomingForm();
    var name = "";
    form.on('field', function (field, value) {
      db.serialize(function(){
        if(field == 'user_name'){
          name = value;
          db.run("CREATE TABLE "+name+" (name TEXT, id TEXT)");
        }
        if(field == 'name'){
          db.run("INSERT INTO "+name+" (name) VALUES ('"+value+"')");
        }
        if (field == 'id'){
          db.run("INSERT INTO "+name+" (id) VALUES ('"+value+"')");
        }
        if (field !== 'name' && field !== 'id'){
          console.log("ALTER TABLE "+name+" ADD COLUMN "+field+" TEXT");
          db.run("ALTER TABLE "+name+" ADD COLUMN "+field+" TEXT");
          db.run("INSERT INTO "+name+" ("+field+") VALUES ('"+value+"')");


        }
      });
        fields[field] = value;
        field_names[num] = field;

    });

    form.on('end', function () {
      console.log('form submitted');
      fs.readFile('submitted.html', function(err,data){
        res.writeHead(200, {
            'content-type': 'text/html'
        });
        res.write(data);
        res.end();
      });
    });
    form.parse(req);
}

server.listen(8888);
console.log("server listening on 8888");
