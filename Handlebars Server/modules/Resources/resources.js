/**
 * Created by Jaco-Louis on 2015/03/20.
 */
/*
 *  Created by Paul Engelke (u13093500)
 */

// REQUIRES:
var mongoose = require('mongoose');

var multer = require('multer');
var fs = require('fs');
var schemas = require('./schemas.js');

var tempDir = './temp';
var maxSize = 16*1024*1024; //allowed by database
var constraints = {};

// defines and object resources
var resources = module.exports = {};

/**
 * This function is called by the upload handler in the server.
 * @param req The request object.
 * @param res The result object.
 * @param next The next server function call in the Daisy Chain.
 * @param postID The post that references the file.
 */
resources.uploadFile = function(req, res, postID){

    var handler = multer({

        dest:
            tempDir,
        limits: {
            fileSize: maxSize
        },

        rename:
            function (fieldname, filename){
                return filename.replace(/\W+/g, '-').toLowerCase()+Date.now();
            },
        onFileUploadStart:
            function(file, req, res){
                return uploadFileStart(file, req, res);
            },
        onFileUploadData:
            function(file, data, req, res){
                return uploadFileData(file, data, req, res);
            },
        onFileSizeLimit: function(file){
            deleteTemp(file);
        },
        onFileUploadComplete:
            function(file, req, res){
                uploadFileComplete(file, req, res, postID);
            }
    });

    var C = mongoose.model('Resource_Constraints', schemas.constraintSchema);

    C.find({}, function(err, cons){

        if (err){
            console.log(JSON.stringify(err));
        } else {//  populate constraints array

            constraints = cons;

            handler(req, res); // calls the handler.
        }
    })
}

/**
 * PRIVATE: This method is not exported.
 *
 * Handles the start of a file upload. Checks the mime type of the file before
 * uploading.
 * @param file The file to be uploaded.
 * @param req The request object.
 * @param res The response object.
 * @returns {boolean} True if upload my continue, else false.
 */
uploadFileStart = function(file, req, res){

    if (!resources.checkMimeType(file.mimetype)){

        console.log(file.name+" could not be uploaded.")
        return false;
    }

    console.log("Starting upload of file "+file.name+"...");
    return true;
}

/**
 * PRIVATE: This method is not exported.
 *
 * NICE TO HAVE, NOT NECESSARY NOW
 *
 * STUB
 *
 * Displays progress of upload.
 * @param file The file being uploaded.
 * @param data
 * @param req The request object.
 * @param res The response object.
 * @returns {boolean} True if upload my continue, else false.
 */
uploadFileData = function(file, data, req, res){

    //return true;
}

/**
 * PRIVATE: This method is not exported.
 *
 * Handles the event for when a file upload is complete.
 * @param file The file that was uploaded.
 * @param req The request object.
 * @param res The response object.
 * @param postID The post which references the file.
 */
uploadFileComplete = function(file, req, res, postID){

    // write to database and remove file from temp
    console.log("Upload complete.");

    var R = mongoose.model('Resources', schemas.resourceSchema);
    var r = new R;

    r.file_name = file.name;
    r.data = fs.readFileSync(file.path);
    r.hidden = false;
    r.postID = postID;
    r.save(function(err){
        if (!err){
            console.log("File successfully saved.");
        } else {
            console.log(err);
        }
        deleteTemp(file);
    });
}

/**
 * PRIVATE: This method is not exported.
 *
 * Removes the uploaded file from the temp folder
 * @param file The file to be deleted.
 */
deleteTemp = function(file){

    fs.unlink(file.path);
}

/**
 * Locates and removes the indicated resource, if possible.
 * @param resourceID The id of the resource to be removed.
 * @returns {boolean} True if successful, else false.
 */
resources.removeResource = function(resourceID){

    var R = mongoose.model('Resources', schemas.resourceSchema);

    R.findOneAndUpdate({'_id' : resourceID}, {'hidden' : true}, function(err){
        if (err){
            return false;
        } else {
            return true;
        }
    });
}

/**
 * Validates the MIME type of the file and sets max file size for that MIME type.
 * @param mimeType The MIME type to be validated.
 * @returns {boolean} True if MIME type is allowed, else false.
 */
resources.checkMimeType = function(mimeType){

    for (var i = 0; i < constraints.length; i++){
        if (constraints[i].mime_type === mimeType){
            return true;
        }
    }

    return false;
}

/**
 * Adds a new constraint to the Resource_Constraints collection in the database.
 * @param mimeType The new MIME type
 * @param sizeLimit The size limit for the MIME type.
 * @returns {boolean} True if successfully added, else false.
 */
resources.addConstraint = function(mimeType, sizeLimit){

    var C = mongoose.model('Resource_Constraints', schemas.constraintSchema);
    var c = new C;

    c.mime_type = mimeType;
    c.size_limit = sizeLimit;
    c.save(function(err){
        if (err){
            return false;
        } else {
            return true;
        }
    });
}

/**
 * Removes a constraint from the Resource_Constraints collection.
 * @param constraintID The ID of the constraint to be removed.
 * @returns {boolean} True if successfully removed, else false.
 */
resources.removeConstraint = function(constraintID){

    var C = mongoose.model('Resource_Constraints', schemas.constraintSchema);

    C.findOneAndRemove({'_id' : constraintID}, function(err){
        if (err){
            return false;
        } else {{
            return true;
        }}
    });
}

/**
 * Updates the specified constraint with a new size limit.
 * @param constraintID The ID of the constraint to be updated.
 * @param sizeLimit The new size limit of the constraint.
 * @return {boolean} True if successful, else false.
 */
resources.updateConstraint = function(constraintID, sizeLimit){

    var C = mongoose.model('Resource_Constraints', schemas.constraintSchema);

    C.findOneAndUpdate({'_id' : constraintID}, {'size_limit' : sizeLimit}, function(err){
        if (err){
            return false;
        } else {
            return true;
        }
    });
}