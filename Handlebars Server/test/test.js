var test = require('unit.js');
var buzzStatus = require('../modules/Status/BuzzStatus');
var profileAssessor = require('../modules/Status/ProfileAssessor');
var Schemas = require('../modules/Status/Schemas');
var appraisalType = require('../modules/Status/AppraisalType');

describe('Automatic testing of Status A', function(){
    // Here we test BuzzStatus
    it('Buzz Status test 1', function(){

    });
    // Here we test ProfileAssessor
    it('ProfileAssessor Test 1', function(){

        var tmp = profileAssessor.create('RoleAssessor',function(result)
        {

            var request = {profileID:'ObjectId("5510932ec1df10641d5e9608")'};
            result(request);
            var a = console.log(tmp);
            console.log(a.assessmentContribution);

        });

        // other tests ...
    });
    // Here we test status
    it('Status test 1', function(){
        // other tests ...
    });
});