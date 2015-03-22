
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





//functions 
function activateAppraisalType () {
	// body...
	

}

function createAppraisalType(response)
{
	this.start(response);
}

function assignAppraisalToPost () {
	// body...

}

//Helper function
//openingg db to save data or retrieve
function openDB () {
	// body...

}



//when saving the appraisal to db
function saveAppraisal(name,description,icon)
{

}

//variables to uploading
var querystring = require("querystring"),
    fs = require("fs"),
    fse   = require('fs-extra'),
    formidable = require("formidable");

//upload form
function start(response) {
    console.log("Request handler 'start' was called.");

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


    var form = new formidable.IncomingForm();
    console.log("about to parse");
    form.parse(request, function(error, fields, files) {
        console.log("parsing done");

        /* Possible error on Windows systems:
         tried to rename to an already existing file */
        console.log(" FROM : "+files.upload.path+" vs "+files.upload.name);
        console.log(files.upload.path+"/"+files.upload.name+" vs ")

        fs.rename(files.upload.path, "/tmp/test.png", function(error) {
            if (error) {
                fs.unlink("/tmp/test.png");
                fs.rename(files.upload.path, "/tmp/test.png");
            }
        });

        response.writeHead(200, {"Content-Type": "text/html"});
        response.write("received image:<br/>");
        response.write("<img src='test.png'>");
        response.write(fields.toLocaleString());
        response.write(fields.name);
        response.write(fields.description);

        name=fields.toLocaleString();
        description=fields.description;
        notRatedIcon=files.upload.name;
        this.saveAppraisal(name,description,notRatedIcon);
        response.end();
    });

  
    show(response);
}




function show(response) {
    console.log("Request handler 'show' was called.");
    response.writeHead(200, {"Content-Type": "image/png"});
    fs.createReadStream("/tmp/test.png").pipe(response);
}

exports.createAppraisalType=createAppraisalType;
exports.start = start;
exports.upload = upload;
exports.show = show;