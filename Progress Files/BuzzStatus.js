/**
 * Created by Tshepiso on 21/03/2015.
 */

var mongoose = require('mongoose');
var schemas = require('./schemas');
var ProfileAssessor = require('./ProfileAssessor');

/**
 * Assigns the ProfileAssessor to a particular Buzz Space and updates all profile statuses
 *   using the new ProfileAssessor (statusCalculator)
 *
 * @param setStatusCalculatorRequest //{spaceID: String, profileAssessorID: String}
 * @returns void
 */
function setStatusCalculator(setStatusCalculatorRequest){
    var SpaceAssessor = mongoose.model('Spaces_Assessors', schemas.spaceAssessorSchema);
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
};

/**
 * Retrieve the status associated with a profile
 *
 * @param getStatusForProfileRequest //{profileID: String}
 * @param callback to be called when result is fulfilled, result is passed to callback
 * @returns Promise //{status: {statusValue: Double}}
 */
function getStatusForProfile(getStatusForProfileRequest, callback){
    var Status = mongoose.model('Status', schemas.statusSchema);
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
 * @param updateAllStatusPointsRequest //{spaceID: String}
 * @returns void
 */
function updateAllStatusPoints(updateAllStatusPointsRequest){
    var Profile = mongoose.model('Profiles', schemas.profileSchema);

    Profile.find({moduleId: updateAllStatusPointsRequest.spaceID}, '_id', function(error, profiles){
        var i;
        for(i in profiles)
            updateStatusPointsForProfile({profileID: profiles[i]._id});
    });
};

/**
 * Updates the status points of the specified profile (using the correct ProfileAssessor)
 *
 * @param updateStatusPointsForProfileRequest //{profileID: String}
 * @returns void
 */
function updateStatusPointsForProfile(updateStatusPointsForProfileRequest){
    var Profile = mongoose.model('Profiles', schemas.profileSchema);
    var SpaceAssessor = mongoose.model('Spaces_Assessors', schemas.spaceAssessorSchema);
    var Status = mongoose.model('Status', schemas.statusSchema);
    var newEntry;

    var statusCalculator;
    //find the profile matching the profileID (to obtain the moduleId
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
};

/**
 * Creates a new global Appraisal type available to all Buzz Spaces
 *
 * @param createAppraisalTypeRequest
 * @returns createAppraisalTypeResult
 */
function createAppraisalType(createAppraisalTypeRequest){
    //stub
};

/**
 * Activates an Appraisal type for a specific period on a specified Buzz Space
 *
 * @param activateAppraisalTypeRequest
 * @returns activateAppraisalTypeResult
 */
function activateAppraisalType(activateAppraisalTypeRequest){
    //stub
};

/**
 * Assigns a specific appraisal to a post
 *
 * @param assignAppraisalToPostRequest //{appraisal :{threadID: String,profileID: String, appraisalLevel: String}}
 * @returns void
 */
function assignAppraisalToPost(assignAppraisalToPostRequest){
    //stub
};

/**
 *
 * @param removeAppraisalTypeRequest
 */
function removeAppraisalType(removeAppraisalTypeRequest){

};

/**
 *
 * @param getAppraisalsForPostRequest
 */
function getAppraisalsForPost(getAppraisalsForPostRequest){

};

module.exports.setStatusCalculator = setStatusCalculator;
module.exports.getStatusForProfile = getStatusForProfile;
module.exports.updateAllStatusPoints = updateAllStatusPoints;
module.exports.updateStatusPointsForProfile = updateStatusPointsForProfile;
module.exports.createAppraisalType = createAppraisalType;
module.exports.activateAppraisalType = activateAppraisalType;
module.exports.assignAppraisalToPost = assignAppraisalToPost;
module.exports.removeAppraisalType = removeAppraisalType;
module.exports.getAppraisalsForPost = getAppraisalsForPost;
