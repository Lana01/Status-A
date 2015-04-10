/**
 * BuzzStatus module
 *
 * Functions returning values rely on other asynchronous functions.
 * As such, they do not explicitly return the data, but rather, follow the convention of
 * passing the return value to a callback function for further processing
 *
 * @module buzz-status
 */

var Schemas = require('./Schemas');

/**
 * AppraisalType definition
 *
 * @param {string} _name
 * @param {string} _description
 * @param {Buffer} _notRatedIcon
 * @param {Array} _AppraisalLevelList
 * @constructor
 */
function AppraisalType(_name, _description, _notRatedIcon, _AppraisalLevelList){
    this.name = _name;
    this.description = _description;
    this.notRatedIcon = _notRatedIcon;
    this.appraisalLevels = _AppraisalLevelList; //This is an ordered list of AppraisalLevel objects
}

/**
 * AppraisalLevel definition
 *
 * @param {string} _name
 * @param {Number} _rating
 * @param {Buffer} _icon
 * @constructor
 */
function AppraisalLevel(_name, _rating,_icon){
    this.name = _name;
    this.rating = _rating;
    this.icon = _icon;
}

/**
 * AppraisalTypeActivation definition
 *
 * @param {Date} _from
 * @param {Date} _to
 * @param {string} _appraisalTypeID
 * @param {string} _spaceID
 * @constructor
 */
function AppraisalTypeActivation(_from, _to, _appraisalTypeID, _spaceID){
    this.activationPeriod = {from: _from, to: _to};
    this.appraisalTypeID = _appraisalTypeID;
    this.spaceID = _spaceID;
}

exports = module.exports = function (buzzDatabase) {
    var status = {};
    var mongoose = buzzDatabase.mongoose;
    var db = buzzDatabase.db;

    /**
     * Constructs a ThreadsDepthAssessor
     * @constructor
     */
    function ThreadsDepthAssessor(){
        /**
         * Assesses specified profile according to criterion
         *
         * @param assessProfileRequest //{profileID: String}
         * @returns assessProfileResult //{contributionResult: {assessmentContribution: Double}}
         */
        this.assessProfile = function(assessProfileRequest){

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

    /**
     * Constructs a NumPostsAssessor
     * @constructor
     */
    function NumPostsAssessor(){
        /**
         * Assesses specified profile according to criterion
         *
         * @param assessProfileRequest //{profileID: String}
         * @returns assessProfileResult //{contributionResult: {assessmentContribution: Double}}
         */
        this.assessProfile = function(assessProfileRequest){

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

    /**
     * Constructs a RoleAssessor
     * @constructor
     */
    function RoleAssessor(){
        /**
         * Assesses specified profile according to criterion
         *
         * @param assessProfileRequest //{profileID: String}
         * @returns assessProfileResult //{contributionResult: {assessmentContribution: Double}}
         */
        this.assessProfile = function(assessProfileRequest){

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

    /**
     * Constructs a WeightedSumProfileAssessor
     * @constructor
     */
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

    /**
     * Constructs an AppraisalAssessor
     * @constructor
     */
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

    /**Factory containing the different ProfileAssessor constructors*/
    var factory = {};
    factory['ThreadsDepthAssessor'] = ThreadsDepthAssessor;
    factory['NumPostsAssessor'] = NumPostsAssessor;
    factory['RoleAssessor'] = RoleAssessor;
    factory['WeightedSumProfileAssessor'] = WeightedSumProfileAssessor;
    factory['AppraisalsAssessor'] = AppraisalAssessor;

    /**
     * Static class providing a factory method for creating specialised ProfileAssessors
     * @type {{ProfileAssessor}}
     */
    var ProfileAssessor = {};

    /**
     * This is a factory function that produces the desired ProfileAssessor object
     *
     * @param {string} specifying which ProfilerAssessor to make
     * @returns {ProfileAssessor}
     */

    ProfileAssessor.create = function(particularAssessor){
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
    };

    /**
     * Assigns the ProfileAssessor to a particular Buzz Space and updates all profile statuses
     *   using the new ProfileAssessor (statusCalculator)
     *
     * @param {SetStatusCalculatorRequest} setStatusCalculatorRequest Structure of {spaceID: String, profileAssessorID: String}
     */
    status.setStatusCalculator = function(setStatusCalculatorRequest) {
        var SpaceAssessor = mongoose.model('Spaces_Assessors', Schemas.spaceAssessorSchema);
        var newEntry;

        //Set profile assessor for space
        SpaceAssessor.update({spaceID: setStatusCalculatorRequest.spaceID},
            {$set: {profileAssessorID: setStatusCalculatorRequest.profileAssessorID}},
            function (error, updated) {
                //no such entry yet, add one
                if (updated == 0) {
                    newEntry = new SpaceAssessor({
                        spaceID: setStatusCalculatorRequest.spaceID,
                        profileAssessorID: setStatusCalculatorRequest.profileAssessorID
                    });
                    newEntry.save();
                }
            });

        //Update all profile statuses on Buzz Space using new assessor
        status.updateAllStatusPoints({spaceID: setStatusCalculatorRequest.spaceID});
    };

    /**
     * Retrieve the status associated with a profile
     *
     * @param getStatusForProfileRequest Structure of {profileID: String}
     * @param callback to be called when result is fulfilled, result is passed to callback
     * @returns getStatusForProfileResult Structure of {status: {statusValue: Double}}
     */
    status.getStatusForProfile = function(getStatusForProfileRequest, callback) {
        var Status = mongoose.model('Status', Schemas.statusSchema);
        Status.findOne({profileID: getStatusForProfileRequest.profileID}, 'statusValue', function (error, status) {
            if (error) {
                console.log(Error(error));
            } else {
                var getStatusForProfileResult = {status: {}};
                getStatusForProfileResult.status.statusValue = status.statusValue;
                callback(getStatusForProfileResult);
            }
        });
    };

    /**
     * Updates the status points of all profiles on a Buzz Space (using the correct ProfileAssessor)
     *
     * @param updateAllStatusPointsRequest Structure of {spaceID: String}
     */
    status.updateAllStatusPoints = function(updateAllStatusPointsRequest) {
        var Profile = mongoose.model('Profiles', Schemas.profileSchema);

        Profile.find({moduleId: updateAllStatusPointsRequest.spaceID}, '_id', function (error, profiles) {
            var i;
            for (i in profiles)
                status.updateStatusPointsForProfile({profileID: profiles[i]._id});
        });
    };

    /**
     * Updates the status points of the specified profile (using the correct ProfileAssessor)
     *
     * @param updateStatusPointsForProfileRequest Structure of {profileID: String}
     */
    status.updateStatusPointsForProfile = function(updateStatusPointsForProfileRequest) {
        var Profile = mongoose.model('Profiles', Schemas.profileSchema);
        var SpaceAssessor = mongoose.model('Spaces_Assessors', Schemas.spaceAssessorSchema);
        var Status = mongoose.model('Status', Schemas.statusSchema);
        var newEntry;

        var statusCalculator;
        //find the profile matching the profileID (to obtain the moduleId)
        Profile.findOne({_id: updateStatusPointsForProfileRequest.profileID}, 'moduleId', function (error, profile) {
            //find the ProfileAssessor in use by that module/space
            SpaceAssessor.findOne({spaceID: profile.moduleId}, 'profileAssessorID', function (error, profileAssessor) {
                if (profileAssessor === null) {
                    //default Profile Assessor is the NumPostsAssessor
                    statusCalculator = ProfileAssessor.create('NumPostsAssessor');
                }
                else {
                    statusCalculator = ProfileAssessor.create(profileAssessor.profileAssessorID);
                }

                //use statusCalculator to calculate the status and persist the result to the database
                var newStatus = statusCalculator.assessProfile({profileID: updateStatusPointsForProfileRequest.profileID})
                    .contributionResult.assessmentContribution;
                Status.update({profileID: updateStatusPointsForProfileRequest.profileID},
                    {$set: {statusValue: newStatus}},
                    function (error, updated) {
                        if (error) {
                            console.log(Error(error))
                        } else if (updated == 0) {
                            //No such entry yet, add one
                            newEntry = new Status({
                                profileID: updateStatusPointsForProfileRequest.profileID,
                                statusValue: newStatus
                            });
                            newEntry.save();
                        }
                    });
            });
        });
    };

    /**
     * Creates a new global Appraisal type available to all Buzz Spaces
     * TODO For now this provides for duplicate Appraisal names (the spec is not clear)
     * @param createAppraisalTypeRequest Structure of {appraisalType: {AppraisalType}}
     * @param callback Called after creation of new Appraisal in the database; Appraisal's ID is provided
     * @returns createAppraisalTypeResult Structure of {appraisalTypeID: String}
     */
    status.createAppraisalType = function(createAppraisalTypeRequest, callback) {
        var reqAppraisalType = createAppraisalTypeRequest.appraisalType;
        var AppraisalTypeModel = mongoose.model('Appraisal_Types', Schemas.appraisalTypeSchema);
        var AppraisalLevelModel = mongoose.model('Appraisal_Levels', Schemas.appraisalLevelSchema);
        var newAppraisalTypeDoc = new AppraisalTypeModel();
        var newAppraisalLevelDoc;
        var appraisalLevelIDList = [];

        newAppraisalTypeDoc.name = reqAppraisalType.name;
        newAppraisalTypeDoc.description = reqAppraisalType.description;
        //TODO Remember to correct Icon (e.g. on right "notRatedIcon.data") after testing
        newAppraisalTypeDoc.notRatedIcon.data = reqAppraisalType.notRatedIcon;
        newAppraisalTypeDoc.notRatedIcon.contentType = reqAppraisalType.notRatedIcon;

        reqAppraisalType.appraisalLevels.forEach(function (appraisalLevel) {
            newAppraisalLevelDoc = new AppraisalLevelModel({
                name: appraisalLevel.name,
                rating: appraisalLevel.rating,
                appraisalType: newAppraisalTypeDoc._id,
                icon: {
                    data: appraisalLevel.icon,
                    contentType: appraisalLevel.icon
                }
            });
            newAppraisalLevelDoc.save(function (error) {//save current Appraisal Level to database
                if (error) {
                    console.log(Error(error));
                }
            });
            appraisalLevelIDList.push(newAppraisalLevelDoc._id);//build up the ordered Appraisal Level ID set
        });

        newAppraisalTypeDoc.appraisalLevelIDs = appraisalLevelIDList;

        var createAppraisalTypeResult = {};
        createAppraisalTypeResult.appraisalTypeID = newAppraisalTypeDoc._id;

        newAppraisalTypeDoc.save(function (error) {//save new Appraisal Definition to database
            if (error) {
                console.log(Error(error));
            }
            callback(createAppraisalTypeResult);//result contains the Appraisal Type ID generated
        });
    };

    /**
     * Activates an Appraisal type for a specific period on a specified Buzz Space
     *
     * @param {ActivateAppraisalTypeRequest} activateAppraisalTypeRequest Structure of {appraisalTypeActivation: {appraisalTypeID: String, spaceID: String}}
     * @returns {ActivateAppraisalTypeResult} activateAppraisalTypeResult
     */
    status.activateAppraisalType = function(activateAppraisalTypeRequest) {
        var activateAppraisalTypeResult = {};
        var appraisalid = activateAppraisalTypeRequest.appraisalTypeID;
        var spaceType = mongoose.model('Spaces_Assessors', Schemas.statusSchema);

        var appraisalType = mongoose.model('Appraisal_Types', Schemas.appraisalTypeSchema);
        var appraisalTypeActivation = mongoose.model('Appraisal_Type_Activations', Schemas.appraisalTypeActivationSchema);
        var spaceid = activateAppraisalTypeRequest.spaceID;
        var period = {
            from: new Date(),
            to: new Date()
        };
        var notupdated = null;
        //checking if appraisalID exist
        appraisalType.find({appraisalLevelIDs: appraisalid}, 'name', function (error, found) {
            if (found != null) {
                appraisalTypeActivation.update({appraisalType: appraisalid}, {
                    $set: {
                        spaceID: spaceid,
                        activationPeriod: period
                    }
                }, function (error, updated) {
                    if (updated == 0) {
                        notupdated = error;
                    }
                    else {
                        activateAppraisalTypeResult.appraisalType = appraisalid;
                        activateAppraisalTypeResult.spaceID = spaceid;
                        activateAppraisalTypeResult.activationPeriod = period;

                    }
                });
            }

        });

        if (notupdated == null) {
            spaceType.update({spaceID: spaceid}, {$set: {isOpen: true}}, function (error, spaced) {
                if (spaced == 0) {
                    console.log("Space Doesn't  Exist");
                }
                else {
                    console.log(activateAppraisalTypeResult);
                }
            });
        }

        return activateAppraisalTypeResult;
    };

    /**
     * Assigns (tags) a specific appraisal to a post
     *
     * @param assignAppraisalToPostRequest Structure of {appraisal :{threadID: String,profileID: String, appraisalLevel: String}}
     */
    status.assignAppraisalToPost = function(assignAppraisalToPostRequest) {
        var threadID = assignAppraisalToPostRequest.threadID;
        var profileID = assignAppraisalToPostRequest.profileID;
        var appraisalLevelID = assignAppraisalToPostRequest.appraisalLevelID;
        var appraisal = mongoose.model('Appraisals', Schemas.appraisalSchema);
        var tmp = new appraisal({threadID: threadID, profileID: profileID, appraisalTypeID: appraisalLevelID});
        tmp.save(function (err) {
            if (err) throw err;
        });


    };

    /**
     * Removes the requested Appraisal Definition together with its Appraisal Levels
     *
     * @param removeAppraisalTypeRequest Structure of {appraisalTypeID: String}
     */
    status.removeAppraisalType = function(removeAppraisalTypeRequest) {
        var appraisalid = removeAppraisalTypeRequest.appraisalTypeID;
        var Appraisal_Types = mongoose.model('Appraisal_Types', Schemas.appraisalTypeSchema);
        var Appraisal_Levels = mongoose.model('Appraisal_Levels', Schemas.appraisalLevelSchema);

        Appraisal_Types.remove({appraisalLevelIDs: appraisalid}, function (erro) {
            if (!erro) {
                console.log("Removed successful Appraisal_Types");
            }
            else {
                console.log("Removed not successful Appraisal_Types");
            }


        });

        Appraisal_Levels.remove({appraisalType: appraisalid}, function (erro) {
            if (!erro) {
                console.log("Removed successful Appraisal_Levels");
            }
            else {
                console.log("Removed not successful Appraisal_Levels");
            }


        });


    };

    /**
     * Returns all appraisals that have been assigned to a particular post
     * TODO once again not sure about threadID vs postID
     * @param getAppraisalsForPostRequest Structure of {threadID: String}
     * @param callback Invoked after appraisals were retrieved; getAppraisalsForPostResult is provided
     * @returns getAppraisalsForPostResult Structure of {appraisals : [AppraisalLevels,...]}
     */
    status.getAppraisalsForPost = function(getAppraisalsForPostRequest) {
        var appraisalModel = mongoose.model('Appraisals', Schemas.appraisalSchema);
        return appraisalModel.find({threadID: getAppraisalsForPostRequest.threadID});

    };


    return status;
};

exports['@singleton'] = true;
exports['@require'] = ['buzz-database'];
