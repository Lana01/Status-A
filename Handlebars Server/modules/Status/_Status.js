/**
 * Created by TshepiAdmin on 21/03/2015.
 */

/***********************************************************************/
/**************************Database_Connection**************************/
//Retrieve db.
function dbConnection(){
    var mongoose = require('mongoose');

//Connect to the db.
    mongoose.connect('mongodb://45.55.154.156:27017/Buzz');
    var db = mongoose.connection;


    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', function (callback) {
        console.log('Connected...');
    });

    return db;
}
/***********************************************************************/
/****************************BuzzStatus_Class**************************/
var BuzzStatus = function(){};

BuzzStatus.prototype.getProfileStatus = function(getProfileStatusRequest){

    return new setStatusCalculatorResult();
};

BuzzStatus.prototype.setStatusCalculator = function(setStatusCalculatorRequest){

    return new getStatusForProfileResult();
};

function setStatusCalculator(setStatusCalculatorRequest) {


}


function setStatusCalculatorRequest(modID){

    var db = dbConnection();

    BuzzSpace.getModuleId(modID);
};

setStatusCalculatorRequest.prototype.getBuzzSpace = function(BuzzSpace){

    if(BuzzSpace.isOpen == true){

    }else{

    }
};


setStatusCalculatorRequest.prototype.getProfileAccessor = function(ProfileAccessor){

    //ProfileAccessor to be used for calculation of the status.
};


var setStatusCalculatorResult = function(){

};



var Status = function(){
    this.statusValue = 0.0;
};

Status.prototype.setStatusValue = function(statusValue){
    this.statusValue = statusValue;
}

Status.prototype.getStatusValue = function(){
    return this.statusValue;
}


var getStatusForProfileRequest = function(){
    //Retrieve user and module id from database.
};


var getStatusForProfileResult = function(){

};

/*******************************************************************/
/***************************BUZZ SPACE***************************/
var BuzzSpace = function(academicYear, isOpen, moduleId){
    this.academicYear = academicYear;
    this.isOpen = isOpen;
    this.moduleId = moduleId;

};

//var db = dbConnection();

setStatusCalculatorRequest();

function updateAllStatusPoints(){

}

function updateStatusPointsForProfile(){

}
//








