/**
 *  TODO This module only provides stub functionality at the moment
 */



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
        var userID = db.getCollection("Profiles").find({_id:profileID},{userId:1,_id:0});
        userID = userID.userId;

        //get the module that the profile is assigned to.
        var moduleID  = db.getCollection('Profiles').find({_id:profileID},{moduleId:1, _id:0});
        moduleID.moduleId;

        //get the number of posts the user made in that module
        var numPosts = db.getCollection('Threads').find({thread_CreaterID:userID, thread_SpaceID:moduleID}).count();

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
        var userID = db.getCollection("Profiles").find({_id:profileID},{userId:1,_id:0});
        userID.userId;

        //get the module that the profile is assigned to.
        var moduleID  = db.getCollection('Profiles').find({_id:profileID},{moduleId:1, _id:0});
        moduleID.moduleId;

        //get the number of posts the user made in that module
        var numPosts = db.getCollection('Threads').find({thread_CreaterID:userID, thread_SpaceID:moduleID}).count();


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
        var userID = db.getCollection("Profiles").find({_id:profileID},{userId:1,_id:0});
        userID = userID.userId;

        //get the module that the profile is assigned to.
        var moduleID  = db.getCollection('Profiles').find({_id:profileID},{moduleId:1, _id:0});
        moduleID = moduleID.moduleId;

        /*
         get roleID in database and assign value according to role.
         */
        var roleValue = db.getCollection('CorrectField').find({userid:userid, moduleId:moduleID}, {role:1, _id:0});
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
    this.assessProfile = function(assessProfileRequest){

        /*
         sum up the appraisal value of all the threads the user made in that space?
         */

        var mongoose = require('mongoose');
        mongoose.connect('mongodb://45.55.154.156:27017/Buzz');
        var db = mongoose.connection;

        var id = assessProfileRequest.profileID;

        //get the userid
        var userID = db.getCollection('Profiles').find({_id:profileID},{userId:1,_id:0});
        userID = userID.userId;

        //get the module that the profile is assigned to.
        var moduleID  = db.getCollection('Profiles').find({_id:profileID},{moduleId:1, _id:0});
        moduleID = moduleID.moduleId;

        //get all the ids of the threads created by the user for that module
        var threads = db.getCollection('Threads').find({thread_CreaterID:userID, thread_SpaceID:moduleID}, {thread_ID:1,_id:0});


        //for each thread, get the appraisal level and appraisal rating
        return {contributionResult: {assessmentContribution: 5.0}};
    };
}

//Factory containing the different ProfileAssessor constructors
var factory = {};
factory['ThreadsDepthAssessor'] = ThreadsDepthAssessor.assessProfile;
factory['NumPostsAssessor'] = NumPostsAssessor.assessProfile;
factory['RoleAssessor'] = RoleAssessor.assessProfile;
factory['WeightedSumProfileAssessor'] = WeightedSumProfileAssessor.assessProfile;
factory['AppraisalsAssessor'] = AppraisalAssessor.assessProfile;

/**
 * This is a factory function that produces the desired ProfileAssessor object
 *
 * @param particularAssessor String specifying which ProfilerAssessor to make
 * @returns ProfileAssessor
 */
function create(particularAssessor){
    //if (typeof factory[particularAssessor] === 'function')
    //{
    //    console.log("Function was called");
        return factory[particularAssessor]();
        //callback(new factory[particularAssessor]());}
   // }
   // else
   // {
   //     console.log("Returning null");
   //     return null;
   // }
}

exports.create = create;
