
//Db
var dbs;
var mongoose;
dbConnection();

//Schemas
var appr_SubTypes = mongoose.Schema({
    name     :String,
    point_value    :Number,
    icon_id : String
});
var AppraisalTypesSchema = mongoose.Schema({

    appr_ID      :String,
    appr_Name    :String,
    appr_Description : String,
    appr_Subtypes : [appr_SubTypes]

});
var appraisalType = mongoose.model('AppraisalType', AppraisalTypesSchema);
removeAppraisalType('0');
function dbConnection(){
    mongoose = require('mongoose');

//Connect to the db.
    mongoose.connect('mongodb://45.55.154.156:27017/Buzz');

    var db = mongoose.connection;


    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', function (callback) {
        console.log('Connected... now return');
        dbs=db;
    });


}

//Create Subtype
function createAppraisalSubType(name, pointValue, iconID)
{
    var apprSub = mongoose.model('appr_SubTypes', appr_SubTypes);
    var subType = new apprSub;
    subType.name = name;
    subType.point_value = pointValue;
    subType.icon_id = iconID;
    return subType;
}
//Create type
function createAppraisalType(apprID, apprName, apprDesc, apprSub)
{


    var type = new appraisalType;
    type.appr_ID = apprID;
    type.appr_Name = apprName;
    type.appr_Description = apprDesc;
    type.appr_Subtypes = apprSub;
    type.save(function (err){if(err) return handleError(err);})
    console.log("saved to db");
}

//remove type
function removeAppraisalType(apprID)
{

    appraisalType.remove({appr_id : apprID}), function(err){
        if(err) return handleError(err);
    }
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




