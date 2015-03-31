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

        /*
        Find the number of threads the user created.
         */
        var id = assessProfileRequest.profileID;
        var numThreads = db.getCollection('Threads').find({thread_CreaterID:id}).count();

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

        var numPosts = db.getCollection('Threads').find({thread_CreaterID:id}).count();

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

        /*
        get roleID in database and assign value according to role.
         */
        var roleValue = db.getCollection('CorrectField').find({userID:id}, {role:1, _id:0});

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
    if (typeof factory[particularAssessor] === 'function')
        return new factory[particularAssessor]();
    else
        return null;
}

exports.create = create;