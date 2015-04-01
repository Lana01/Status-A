/**
 * BuzzStatus module
 *
 * Functions returning values rely on other asynchronous functions.
 * As such, they do not explicitly return the data, but rather, follow the convention of
 * passing the return value to a callback function for further processing
 */

var mongoose = require('mongoose');
var Schemas = require('./Schemas');
var ProfileAssessor = require('./ProfileAssessor');

/**
 * Assigns the ProfileAssessor to a particular Buzz Space and updates all profile statuses
 *   using the new ProfileAssessor (statusCalculator)
 *
 * @param setStatusCalculatorRequest Structure of {spaceID: String, profileAssessorID: String}
 */
function setStatusCalculator(setStatusCalculatorRequest){
    var SpaceAssessor = mongoose.model('Spaces_Assessors', Schemas.spaceAssessorSchema);
    var newEntry;

    //Set profile assessor for space
    SpaceAssessor.update({spaceID: setStatusCalculatorRequest.spaceID},
        {$set:{profileAssessorID: setStatusCalculatorRequest.profileAssessorID}},
            function(error, updated){
                //no such entry yet, add one
                if(updated == 0){
                    newEntry = new SpaceAssessor({spaceID:setStatusCalculatorRequest.spaceID,
                        profileAssessorID: setStatusCalculatorRequest.profileAssessorID});
                    newEntry.save();
                }
            });

    //Update all profile statuses on Buzz Space using new assessor
    updateAllStatusPoints({spaceID:setStatusCalculatorRequest.spaceID});
}

/**
 * Retrieve the status associated with a profile
 *
 * @param getStatusForProfileRequest Structure of {profileID: String}
 * @param callback to be called when result is fulfilled, result is passed to callback
 * @returns getStatusForProfileResult Structure of {status: {statusValue: Double}}
 */
function getStatusForProfile(getStatusForProfileRequest, callback){
    var Status = mongoose.model('Status', Schemas.statusSchema);
    Status.findOne({profileID: getStatusForProfileRequest.profileID}, 'statusValue', function(error, status){
            if(error){
                console.log(Error(error));
            }else{
                var getStatusForProfileResult = {status:{}};
                getStatusForProfileResult.status.statusValue = status.statusValue;
                callback(getStatusForProfileResult);
            }
    });
}

/**
 * Updates the status points of all profiles on a Buzz Space (using the correct ProfileAssessor)
 *
 * @param updateAllStatusPointsRequest Structure of {spaceID: String}
 */
function updateAllStatusPoints(updateAllStatusPointsRequest){
    var Profile = mongoose.model('Profiles', Schemas.profileSchema);

    Profile.find({moduleId: updateAllStatusPointsRequest.spaceID}, '_id', function(error, profiles){
        var i;
        for(i in profiles)
            updateStatusPointsForProfile({profileID: profiles[i]._id});
    });
}

/**
 * Updates the status points of the specified profile (using the correct ProfileAssessor)
 *
 * @param updateStatusPointsForProfileRequest Structure of {profileID: String}
 */
function updateStatusPointsForProfile(updateStatusPointsForProfileRequest){
    var Profile = mongoose.model('Profiles', Schemas.profileSchema);
    var SpaceAssessor = mongoose.model('Spaces_Assessors', Schemas.spaceAssessorSchema);
    var Status = mongoose.model('Status', Schemas.statusSchema);
    var newEntry;

    var statusCalculator;
    //find the profile matching the profileID (to obtain the moduleId)
    Profile.findOne({_id: updateStatusPointsForProfileRequest.profileID},'moduleId',function(error, profile){
        //find the ProfileAssessor in use by that module/space
        SpaceAssessor.findOne({spaceID: profile.moduleId}, 'profileAssessorID', function(error, profileAssessor){
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
                {$set:{statusValue: newStatus}},
                    function(error, updated){
                        if (error){
                            console.log(Error(error))
                        } else if(updated == 0){
                            //No such entry yet, add one
                            newEntry = new Status({profileID:updateStatusPointsForProfileRequest.profileID,
                                statusValue: newStatus});
                            newEntry.save();
                        }
                    });
        });
    });
}

/**
 * Creates a new global Appraisal type available to all Buzz Spaces
 * TODO For now this provides for duplicate Appraisal names (the spec is not clear)
 * @param createAppraisalTypeRequest Structure of {appraisalType: {AppraisalType}}
 * @param callback Called after creation of new Appraisal in the database; Appraisal's ID is provided
 * @returns createAppraisalTypeResult Structure of {appraisalTypeID: String}
 */
function createAppraisalType(createAppraisalTypeRequest, callback){
    var reqAppraisalType = createAppraisalTypeRequest.appraisalType;
    var AppraisalTypeModel = mongoose.model('Appraisal_Types',Schemas.appraisalTypeSchema);
    var AppraisalLevelModel= mongoose.model('Appraisal_Levels',Schemas.appraisalLevelSchema);
    var newAppraisalTypeDoc = new AppraisalTypeModel();
    var newAppraisalLevelDoc;
    var appraisalLevelIDList = [];
    
    newAppraisalTypeDoc.name = reqAppraisalType.name;
    newAppraisalTypeDoc.description = reqAppraisalType.description;
    //TODO Remember to correct Icon (e.g. on right "notRatedIcon.data") after testing
    newAppraisalTypeDoc.notRatedIcon.data = reqAppraisalType.notRatedIcon;
    newAppraisalTypeDoc.notRatedIcon.contentType = reqAppraisalType.notRatedIcon;
    
    reqAppraisalType.appraisalLevels.forEach(function(appraisalLevel){
        newAppraisalLevelDoc = new AppraisalLevelModel({
            name: appraisalLevel.name,
            rating: appraisalLevel.rating,
            appraisalType: newAppraisalTypeDoc._id,
            icon: {
                data: appraisalLevel.icon,
                contentType: appraisalLevel.icon
            }
        });
        newAppraisalLevelDoc.save(function(error){//save current Appraisal Level to database
            if(error){
                console.log(Error(error));
            }
        });
        appraisalLevelIDList.push(newAppraisalLevelDoc._id);//build up the ordered Appraisal Level ID set
    });

    newAppraisalTypeDoc.appraisalLevelIDs = appraisalLevelIDList;

    var createAppraisalTypeResult = {};
    createAppraisalTypeResult.appraisalTypeID = newAppraisalTypeDoc._id;

    newAppraisalTypeDoc.save(function(error){//save new Appraisal Definition to database
        if(error){
            console.log(Error(error));
        }
        callback(createAppraisalTypeResult);//result contains the Appraisal Type ID generated
    });
}

/**
 * Activates an Appraisal type for a specific period on a specified Buzz Space
 *
 * @param activateAppraisalTypeRequest Structure of {appraisalTypeActivation: {appraisalTypeID: String, spaceID: String}}
 * @returns activateAppraisalTypeResult
 */
function activateAppraisalType(activateAppraisalTypeRequest){
    //stub
   
    var appraisalid=activateAppraisalTypeRequest.appraisalTypeID;
    var spaceType=mongoose.model('Spaces_Assessors',Schemas.statusSchema);
   
    var appraisalType= mongoose.model('Appraisal_Types',Schemas.appraisalTypeSchema);
    var appraisalTypeActivation=mongoose.model('Appraisal_Type_Activations',Schemas.appraisalTypeActivationSchema);
    var spaceid=activateAppraisalTypeRequest.spaceID;
    var period={
        from:new Date(),
        to:new Date()
    };
    var notupdated=null;
    //checking if appraisalID exist 
    appraisalType.find({appraisalLevelIDs:appraisalid},'name',function(error,found){
        if(found!=null)
        {
            appraisalTypeActivation.update({appraisalType:appraisalid},{$set:{spaceID:spaceid,activationPeriod:period}},function(error,updated){
                if(updated==0)
                {
                    notupdated=error;
                }
            });
        }

    });

    if(notupdated==null)
    {
        spaceType.update({spaceID:spaceid},{$set:{isOpen:true}},function(error,spaced){
            if(notupdated==0)
            {
                throw "Space Doesnt Exist";
            }
        });
    }







}

/**
 * Assigns (tags) a specific appraisal to a post
 *
 * @param assignAppraisalToPostRequest Structure of {appraisal :{threadID: String,profileID: String, appraisalLevel: String}}
 */
function assignAppraisalToPost(assignAppraisalToPostRequest){
    //stub
}

/**
 * Removes the requested Appraisal Definition together with its Appraisal Levels
 *
 * @param removeAppraisalTypeRequest Structure of {appraisalTypeID: String}
 */
function removeAppraisalType(removeAppraisalTypeRequest){
    //stub
    var appraisalid=removeAppraisalTypeRequest.appraisalTypeID;
    var Appraisal_Types=mongoose.model('Appraisal_Types',Schemas.appraisalTypeSchema);
    Appraisal_Types.remove({appraisalLevelIDs:appraisalid},function(erro){
        if(!erro)
        {
            console.log("Removed sucessful");
        }


    });
}

/**
 * Returns all appraisals that have been assigned to a particular post
 * TODO once again not sure about threadID vs postID
 * @param getAppraisalsForPostRequest Structure of {threadID: String}
 * @param callback Invoked after appraisals were retrieved; getAppraisalsForPostResult is provided
 * @returns getAppraisalsForPostResult Structure of {appraisals : [AppraisalLevels,...]}
 */
function getAppraisalsForPost(getAppraisalsForPostRequest, callback){
    //stub
}

module.exports.setStatusCalculator = setStatusCalculator;
module.exports.getStatusForProfile = getStatusForProfile;
module.exports.updateAllStatusPoints = updateAllStatusPoints;
module.exports.updateStatusPointsForProfile = updateStatusPointsForProfile;
module.exports.createAppraisalType = createAppraisalType;
module.exports.activateAppraisalType = activateAppraisalType;
module.exports.assignAppraisalToPost = assignAppraisalToPost;
module.exports.removeAppraisalType = removeAppraisalType;
module.exports.getAppraisalsForPost = getAppraisalsForPost;
