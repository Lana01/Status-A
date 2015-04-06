var test = require('unit.js');
var buzzStatus = require('../modules/Status/BuzzStatus');
var profileAssessor = require('../modules/Status/ProfileAssessor');
var Database = require('../modules/Database/Database');

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
        var tmp = profileAssessor.create('AppraisalsAssessor');
        var request = {profileID:'ObjectId("5510932ec1df10641d5e9608")'};
        //test.assert(typeof tmp(request) === 'function');
        test.assert(tmp.name === 'AppraisalsAssessor');
        tmp.assessProfile(request);
        //tmp(request);
        //other tests ...
    });
    // Here we test status
    it('Status test 1', function(){
        // other tests ...
    });
});