/*var test = require('unit.js');
var buzzStatus = require('../modules/Status/BuzzStatus');
var profileAssessor = require('../modules/Status/ProfileAssessor');
var AssignAppraisalToPost = require('../modules/Status/AssignAppraisalToPost');
var Database = require('../modules/Database/Database');
var mongoose = require('mongoose');
var Schemas = require("../modules/Status/Schemas");

*/
var IoC = require('electrolyte');
IoC.loader(IoC.node('node_modules'));
var buzzStatus = IoC.create('buzz-status');

console.log(buzzStatus);


describe('Automatic testing of Status A', function(){
    // Here we test BuzzStatus
    it('Buzz Status test 1', function(){

        //getStatusForProfile
        buzzStatus.getStatusForProfile({profileID: "5510932ec1df10641d5e9608"}, function(result){
            console.log(result);
        });

        //activating
       var tmp= buzzStatus.activateAppraisalType({appraisalTypeID: "5513f7004af522f6583d9f14", spaceID: "COS 332"});

        console.log(tmp);

        //removal of buzz space
        buzzStatus.removeAppraisalType({appraisalTypeID: "550d46d84af522f6583d9eef"});


    });
    // Here we test ProfileAssessor
    it('ProfileAssessor Test 1', function(){
        //console.log("Testing..")
        //var tmp = profileAssessor.create('AppraisalsAssessor');
        //var request = {profileID:'ObjectId("5510932ec1df10641d5e9608")'};
        //test.assert(typeof tmp(request) === 'function');
        //test.assert(tmp.name === 'AppraisalsAssessor');
        //tmp.assessProfile(request);
        //tmp(request);
        //other tests ...
    });
    // Here we test status
    it('Status test 1', function(){
        // other tests ...
    });
    it('Test Appraisals db interaction ', function()
    {

        //var tmp = new AssignAppraisalToPost(mongoose.Types.ObjectId("5513f8934af522f6583d9f15"), mongoose.Types.ObjectId(), mongoose.Types.ObjectId());
        //buzzStatus.assignAppraisalToPost(tmp);

        //var appraisalModel = mongoose.model('Appraisals', Schemas.appraisalSchema);
        //appraisalModel.remove({threadID:mongoose.Types.ObjectId("5513f8934af522f6583d9f15")}, function (err) {
        //   if(err) throw err;
        //});
    });
});