exports = module.exports = function(database, resources, reporting) {
    var express = require('express');
    var router = express.Router();

    var mongoose = database.mongoose;

    function getDemoProfile(id) {
        return {title: "user " + id};
    }

    var spaceDemoSchema = mongoose.Schema({
        space_ID: String,
        space_Name: String,
        space_Description: String
    }, {
        collection: 'Spaces'
    });

    var ThreadDemoSchema = new mongoose.Schema({
            thread_DateCreated: Date,
            thread_Name: String,
            thread_PostContent: Array,
            thread_CreatorID: String,
            thread_SpaceID: String,
            thread_StatusID: Array,
            thread_Parent: String,
            thread_Archived: Date,
            thread_Attachments: Array,
            thread_PostType: String,
            thread_Closed: Boolean,
            thread_DateClosed: Date
        },{
            collection: 'Threads'
        });

    function getThreads(id, callback) {
        var threadModel = mongoose.model("Threads_1", ThreadDemoSchema);
        threadModel.find({thread_SpaceID: id}, function (err, threads) {
            if (err) {
            }
            else {
                var newData = {};
                newData.title = id;
                newData.threads = threads;
                callback(newData);
            }
        });
    }

    function getSpaces(callback) {
        var spaceModel = mongoose.model('Spaces_1', spaceDemoSchema);
        spaceModel.find({}, function (err, spaces) {
            if (err) {

            }
            else {
                callback(spaces);
            }

        });
    }

    /********* Demo Routing ************/

    /* GET home page. */
    router.get('/', function (req, res, next) {
//Pass to page
        getSpaces(function (obj2) {
            var obj = {};
            obj.spaces = obj2;
            obj.title = "Buzz++@UP";
            //console.log(obj);
            res.render('index', obj);
        })
    });

    router.get('/blank', function (req, res, nect) {
        res.render('blank', {title: "Content Unavailable"});
    });

    router.get('/demoThreads', function (req, res, next) {
        var space = req.query.space;
        getThreads(space, function (obj) {

            // console.log(obj);
            res.render('thread', obj);
        })
    });

    //Eg use get arguments from URL
    router.get('/testing', function (req, res, next) {
        res.render('test', getDemoProfile(req.query.id));
    });

    /******** Content Routing ****************/

    /***********Buzz Status routing ****************/
    var querystring = require("querystring"),
    fs = require("fs"),
    fse   = require('fs-extra'),
    formidable = require("formidable");

    router.get('/createAppraisalType', function (req, res, next) {
            
            upload(res,req);

    });

    router.get('/appraisals', function (req, res, next) {

        //reference of how to parse object
       /* {
            appraisal : [
                { name: "Yehuda", descrption: "Katz", icon:"me"},
                { name: "Carl", descrption: "Lerche" ,icon:"me"},
                { name: "Alan", descrption: "Johnson" ,icon:"me"}
            ]
        }*/

        var appraisalType = mongoose.model('Appraisal_Types', Schemas.appraisalTypeSchema);
        var arr = [];
        appraisalType.find({}, function (error, found) {

            found.forEach(function(user) {
                arr.push(
                    {
                        name:user.name,
                        descrption:user.description,
                        icon:user.notRatedIcon.data
                    }
                );
            });
        });

        res.render('appraisals', arr);
    });

    //saving uploaded data from the form 
    function upload(response, request) {
    //console.log("Request handler 'upload' was called.");
    var target_path=null;
    var form = new formidable.IncomingForm();
    //console.log("about to parse");
    form.parse(request, function(error, fields, files) {
      
        
/* Possible error on Windows systems:
         tried to rename to an already existing file */

     
        //console.log(" FROM : "+files.upload.path+" vs "+files.upload.name);
        //console.log(files.upload.path+"/"+files.upload.name+" vs ");


        target_path='./icons/'+files.upload.name;
        //moving the picture to new location and saving location as string
        fs.rename(files.upload.path, target_path, function(error) {
            if (error) throw error;
            fs.unlink(files.upload.path, function() {
                if (error) throw error;
                response.write('File uploaded to: ' + target_path + ' - ' + files.upload.size + ' bytes');
                var obj={};
                obj.name=fields.name;
                obj.description=fields.description;
                obj.icon=target_path;

            });
        });

      //  console.log("Done with it");

        response.writeHead(200, {"Content-Type": "text/html"});
        response.write("received icon:<br/>");
        //saving the string name and other fields
        response.end();

    });
}

   return  router;

};

exports['@literal'] = false;
exports['@require'] = ['buzz-database', 'buzz-resources' ,'buzz-reporting'];
