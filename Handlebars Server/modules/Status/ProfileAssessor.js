var mongoose = require('mongoose');
var Schemas = require('./Schemas');
var Database = require('../Database/Database');

function ThreadsDepthAssessor(){
    /**
     * Assesses specified profile according to criterion
     *
     * @param assessProfileRequest //{profileID: String}
     * @returns assessProfileResult //{contributionResult: {assessmentContribution: Double}}
     */
    this.assessProfile = function(assessProfileRequest){

        var mongoose = require('mongoose');
        mongoose.connect('mongodb://45.55.154.156:27017/Buzz');
        var db = mongoose.connection;

        var id = assessProfileRequest.profileID;
        //console.log(id);

        //get the userid
        var userID = db.collection("Profiles").find({_id:profileID},{userId:1,_id:0});
        userID = userID.userId;

        //get the module that the profile is assigned to.
        var moduleID  = db.collection('Profiles').find({_id:profileID},{moduleId:1, _id:0});
        moduleID.moduleId;

        //get the number of posts the user made in that module
        var numPosts = db.collection('Threads').find({thread_CreaterID:userID, thread_SpaceID:moduleID}).count();

        /*
         Get the average tree size
         */

        return {contributionResult: {assessmentContribution: 1.0}};
    };
}

function NumPostsAssessor(){
    /**
     * Assesses specified profile according to criterion
     *
     * @param assessProfileRequest //{profileID: String}
     * @returns assessProfileResult //{contributionResult: {assessmentContribution: Double}}
     */
    this.assessProfile = function(assessProfileRequest){

        var mongoose = require('mongoose');
        mongoose.connect('mongodb://45.55.154.156:27017/Buzz');
        var db = mongoose.connection;

        var id = assessProfileRequest.profileID;

        //get the userid
        var userID = db.collection("Profiles").find({_id:profileID},{userId:1,_id:0});
        userID.userId;

        //get the module that the profile is assigned to.
        var moduleID  = db.collection('Profiles').find({_id:profileID},{moduleId:1, _id:0});
        moduleID.moduleId;

        //get the number of posts the user made in that module
        var numPosts = db.collection('Threads').find({thread_CreaterID:userID, thread_SpaceID:moduleID}).count();


        return {contributionResult: {assessmentContribution: numPosts}};
    };
}

function RoleAssessor(){
    /**
     * Assesses specified profile according to criterion
     *
     * @param assessProfileRequest //{profileID: String}
     * @returns assessProfileResult //{contributionResult: {assessmentContribution: Double}}
     */
    this.assessProfile = function(assessProfileRequest){

        var mongoose = require('mongoose');
        mongoose.connect('mongodb://45.55.154.156:27017/Buzz');
        var db = mongoose.connection;

        var id = assessProfileRequest.profileID;

        //get the userid
        var userID = db.collection("Profiles").find({_id:profileID},{userId:1,_id:0});
        userID = userID.userId;

        //get the module that the profile is assigned to.
        var moduleID  = db.collection('Profiles').find({_id:profileID},{moduleId:1, _id:0});
        moduleID = moduleID.moduleId;

        /*
         get roleID in database and assign value according to role.
         */
        var roleValue = db.collection('CorrectField').find({userid:userid, moduleId:moduleID}, {role:1, _id:0});
        roleValue = roleValue.role;

        /*
         assign value according to specific role;
         */
        var value = 0;
        return {contributionResult: {assessmentContribution: value}};
    };
}

function WeightedSumProfileAssessor(){
    /**
     * Assesses specified profile according to criterion
     *
     * @param assessProfileRequest //{profileID: String}
     * @returns assessProfileResult //{contributionResult: {assessmentContribution: Double}}
     */
    this.assessProfile = function(assessProfileRequest){

        return {contributionResult: {assessmentContribution: 4.0}};
    };
}

function AppraisalAssessor(){
    /**
     * Assesses specified profile according to criterion
     *
     * @param assessProfileRequest //{profileID: String}
     * @returns assessProfileResult //{contributionResult: {assessmentContribution: Double}}
     */
    this.name = 'AppraisalsAssessor';
    this.assessProfile = function(assessProfileRequest){

        /*
         sum up the appraisal value of all the threads the user made in that space?
         */
        var Profile = mongoose.model('Profiles', Schemas.profileSchema);

        Profile.findOne({moduleId: assessProfileRequest.spaceID}, '_id', function(error, profiles){
            // Check if there was an error in querying the database;
            if(error)
            {
                console.log(Error(error));
                //mongoose.disconnect();
            }
            else
            {
                console.log(profiles._id);
                //mongoose.disconnect();
            }
        });



        //get the userid
       // var userID = db.collection('Profiles').find({_id:profileID},{userId:1,_id:0});
        //userID = userID.userId;

        //get the module that the profile is assigned to.
        //var moduleID  = db.collection('Profiles').find({_id:profileID},{moduleId:1, _id:0});
        //moduleID = moduleID.moduleId;

        //get all the ids of the threads created by the user for that module
        //var threads = db.collection('Threads').find({thread_CreaterID:userID, thread_SpaceID:moduleID}, {thread_ID:1,_id:0});


        //for each thread, get the appraisal level and appraisal rating
        return {contributionResult: {assessmentContribution: 5.0}};
    };
}

//Factory containing the different ProfileAssessor constructors
var factory = {};
factory['ThreadsDepthAssessor'] = ThreadsDepthAssessor;
factory['NumPostsAssessor'] = NumPostsAssessor;
factory['RoleAssessor'] = RoleAssessor;
factory['WeightedSumProfileAssessor'] = WeightedSumProfileAssessor;
factory['AppraisalsAssessor'] = AppraisalAssessor;

/**
 * This is a factory function that produces the desired ProfileAssessor object
 *
 * @param particularAssessor String specifying which ProfilerAssessor to make
 * @returns ProfileAssessor
 */
function create(particularAssessor){
    //if (typeof factory[particularAssessor] === 'function')
    //{
        //console.log("Returning assesor");
        return new factory[particularAssessor]();
        //callback(new factory[particularAssessor]());}
    //}
    //else
    //{
        //console.log("Returning null");
    //    return null;
    // }
}

module.exports.create = create;
exports['@require'] = ['create'];
