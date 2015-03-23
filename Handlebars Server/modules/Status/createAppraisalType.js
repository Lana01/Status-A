
//Db
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

//class AppraisalType
function AppraisalType (nme,des,rate,act) {
	// body...
	this.name=nme; //string
	this.description=des;  //string
	this.notRatedIcon=rate;  //string
	activityPeriod=act;  //Date object

}

//class AppraisalLevel 
function AppraisalLevel () {
	// body...
	this.name; //string
	this.description;  //string
	this.icon;  //string
	
}



var d=new AppraisalLevel();
d.name=asdasd
var BuzzStatus = function(){};

var CreateAppraisalTypeRequest=
{
	return AppraisalType("","","","");
}

var CreateAppraisalTypeRequest=
{
	return AppraisalType("","","","");

BuzzStatus.prototype.CreateAppraisalType= function(createAppraisalTypeRequest : CreateAppraisalTypeRequest){

    return new CreateAppraisalTypeRequest;
};



