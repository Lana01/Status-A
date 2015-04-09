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
var ProfileAssessor = require('./ProfileAssessor');

exports = module.exports = function (buzzDatabase) {
    var status = {};
    var mongoose = buzzDatabase.mongoose;

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
        ;
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
