/**
 * Created by TshepiAdmin on 21/03/2015.
 */

/***********************************************************************/
/**************************Database_Connection**************************/
//Retrieve db.

var mongoose = require('mongoose');

var ProfileSchema = mongoose.Schema({

    userId      :String,
    moduleId    :String,
    status      :Number

});


ProfileSchema.methods.show = function(){
    console.log(this.userId + " " + this.moduleId + " " + this.status);
}

var Profile = mongoose.model('Profile',ProfileSchema);


var profile1 = new Profile({ userId: 'u12345678', moduleId:'COS332', status:0});



function openDbConnection(){


//Connect to the db.
    mongoose.connect('mongodb://45.55.154.156:27017/Buzz');
    var db = mongoose.connection;


    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', function (callback) {
        console.log('Connected...');
    });

    return db;
}

function closeDbConnection(db){

    db.close(function(){
        console.log('Closing connection...');
    });
}

var db = openDbConnection();
/***********************************************************************/
/****************************BuzzStatus_Class**************************/
var BuzzStatus = function(){};

BuzzStatus.prototype.getStatusForProfile = function(getStatusForProfileRequest){

    var result = new getStatusForProfileResult();
    result.status.statusValue = getStatusForProfileRequest.user_status;

    return result;
};

BuzzStatus.prototype.setStatusCalculator = function(setStatusCalculatorRequest){

    var result = new getStatusForProfileResult();
    result.status.statusValue = setStatusCalculatorRequest.user_status;
    //updateStatusPointsForProfile();
    return result;
};


var setStatusCalculatorRequest = function(module_Id,AccessProfileResult){


    this.isOpen = false;

    db.collection('spaces').findOne({moduleID:module_Id}, function (err,data) {

        if(data.isOpen){
            AccessProfileResult.accessmentValue;
        }

    });

    return AccessProfileResult.accessmentValue;
}

setStatusCalculatorRequest.prototype.getProfileAccessor = function(AccessProfileResult){
    //ProfileAccessor to be used for calculation of the status.
};


var setStatusCalculatorResult = function(){
};

var Status = function(){
    this.statusValue = 0.0;
};

Status.prototype.setStatusValue = function(statusValue){
    this.statusValue = statusValue;
};

Status.prototype.getStatusValue = function(){
    return this.statusValue;
};


var getStatusForProfileRequest = function(user_id,module_id){
    //Retrieve user and module id from database.
    var db = openDbConnection();

    db.collection('Profile').findOne({userId:user_id,moduleId:module_id},function(err,data){
        console.log(user_id + " " + module_id);
    });

    this.user_id = user_id;
    this.module_id = module_id;
    this.user_status = 0.0;
};


var getStatusForProfileResult = function(){

    this.status = new Status();
    this.status.statusValue = 0;
};

function updateAllStatusPoints(user_Id,mod_Id,newStatus){

    db.collection('spaces').findOne({userId:user_Id,moduleId:mod_Id}).update({status:newStatus});
}

function updateStatusPointsForProfile(user_Id,mod_Id,newStatus){
    db.collection('spaces').findOne({userId:user_Id,moduleId:mod_Id}).update({status:newStatus});
}

/*
* Test
* setStatusCalculatorRequest('zzz');
* */








