
//Db
var dbs;
function dbConnection(){
    var mongoose = require('mongoose');

//Connect to the db.
    mongoose.connect('mongodb://45.55.154.156:27017/Buzz');

    var db = mongoose.connection;


    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', function (callback) {
        console.log('Connected... now return');
        dbs=db;
    });


}

//class AppraisalType
function AppraisalType (nme,des,rate,act) {
	// body...
	this.name=nme; //string
	this.description=des;  //string
	this.notRatedIcon=rate;  //string
	activityPeriod=act;  //Date object

}

//AppraisalTypeActivation
function AppraisalTypeActivation()
{
    this.activationPeriod;
}

//class AppraisalLevel 
function AppraisalLevel () {
	// body...
	this.name; //string
	this.description;  //string
	this.icon;  //string
	
}

var CreateAppraisalTypeRequest=
{
};

var CreateAppraisalTypeResult={

};

var BuzzStatus = function(){};

exports.createAppraisalType = function(createAppraisalTypeRequest){


    console.log("indised an APP");
    //only adding to database left

    var createAppraisalTypeResult=new AppraisalType("FunnyAppraisalType","smilies","smile.png","time");

    console.log(createAppraisalTypeResult.name+" vs "+createAppraisalTypeResult.description);
    return createAppraisalTypeResult;
};

exports.removeAppraisalType = function(removeAppraisalTypeRequest ){

    //getting name and removing to the database
    var id=removeAppraisalTypeRequest.name;
    return "Removed";

};

exports.activateAppraisalType=function(activateAppraisalTypeRequest)
{
    //adding just period to the class instance
    console.log(activateAppraisalTypeRequest.name+" recieved");
    //need to update database for this
    activateAppraisalTypeRequest.activityPeriod=new Date();
    return activateAppraisalTypeRequest;

};




