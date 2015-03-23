
// member variables for appraisal
var name;
var description;
var notRatedIcon;
var activity ;

//appraisalRating
var ratingName;
var rating;
var ratingIcon;

//AppraisalDefinition
var appraisalName;
var description;
var notRatedIcon;



function assignAppraisalToPost(Post post,Appraisal appraisal)
{
	post.appraisal = appraisal;
}
// We need to read
function getAppraisalForPost(Post post)
{
	return post.appraisal;
}

var period;

//functions 
function activateAppraisalType(apprID) {
	// body...
	var d = new Date();
	period=d;
	 var db=openDB();
   var appA = {
      appr_ID :apprID ,appr_Period : period
    };

    db.collection('Appraisal_Types').insert(appA);

}

function createAppraisalType(response)
{
	this.start(response);
}

function assignAppraisalToPost (apprID, threadID) {

    var mongoose = require('mongoose');
    mongoose.connect('mongodb://45.55.154.156:27017/Buzz');
    var db = mongoose.connection;
    var appThread = {
      appr_ID: apprID, thread_ID : threadID

    };
    db.collection('Appraisal_Threads').insert(appThread);
}

function removeAppraisalType(appraisalID){

    var mongoose = require('mongoose');
    mongoose.connect('mongodb://45.55.154.156:27017/Buzz');
    var db = mongoose.connection;
    db.collection('AppraisalTypes').remove({appr_ID:appraisalID});


}



//Helper function
//openingg db to save data or retrieve
function openDB () {
 var mongoose = require('mongoose');
    mongoose.connect('mongodb://45.55.154.156:27017/Buzz');
    var db = mongoose.connection;
    return db;
}



//when saving the appraisal to db
function saveAppraisal(name,description,icon)
{
    var db=openDB();
    var appA = {
      appr_Name: name, appr_Description : description,appr_ID :icon
    };
    db.collection('Appraisal_Types').insert(appA);

}

var querystring = require("querystring"),
    fs = require("fs"),
    fse   = require('fs-extra'),

    formidable = require("formidable"),
    app=require("express");

function start(response) {
    console.log("Request handler 'start' was called.");

    //form to upload picture for appraisal
    var body = '<html>'+
        '<head>'+
        '<meta http-equiv="Content-Type" '+
        'content="text/html; charset=UTF-8" />'+
        '</head>'+
        '<body>'+
        '<form action="/upload" enctype="multipart/form-data" '+
        'method="post">'
        +'<input type="text" name="name" placeholder="Name" required">'
        +'<input type="text" name="description" placeholder="Description" required>'+
        '<input type="file" name="upload" multiple="multiple">'+
        '<input type="submit" value="Upload file" />'+

    '</form>'+
    '</body>'+
    '</html>';

    response.writeHead(200, {"Content-Type": "text/html"});
    response.write(body);
    response.end();

}


function upload(response, request) {

    console.log("Request handler 'upload' was called.");


    var target_path=null;
    var form = new formidable.IncomingForm();
    console.log("about to parse");
    form.parse(request, function(error, fields, files) {
        console.log("parsing done");

        /* Possible error on Windows systems:
         tried to rename to an already existing file */
     
        console.log(" FROM : "+files.upload.path+" vs "+files.upload.name);
        console.log(files.upload.path+"/"+files.upload.name+" vs ");


        target_path='./icons/'+files.upload.name;
        //moving the picture to new location and saving location as string
        fs.rename(files.upload.path, target_path, function(error) {
            if (error) throw error;
            fs.unlink(files.upload.path, function() {
                if (error) throw error;
                response.write('File uploaded to: ' + target_path + ' - ' + files.upload.size + ' bytes');
            });
        });

        console.log("Done with it");

        response.writeHead(200, {"Content-Type": "text/html"});
        response.write("received image:<br/>");
        response.write(files.upload.name);
        response.write(fields.toLocaleString());
        response.write(fields.name);
        response.write(fields.description);

        //saving the string name and other fields
        saveAppraisal(fields.name,fields.description,target_path);

        show(response,target_path);
        response.end();

    });
  

}


//function to show picture of appraisal
function show(response,name) {
    console.log("Request handler 'show' was called. nd " +name);
    response.writeHead(200, {"Content-Type": "image/png"});
    fs.createReadStream(name).pipe(response);
}


exports.createAppraisalType=createAppraisalType;
exports.start = start;
exports.upload = upload;
exports.show = show;
