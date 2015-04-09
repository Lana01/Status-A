/**
 *
 * @param _threadID ObjectId
 * @param _profileID ObjectId
 * @param _appraisalLevel ObjectId
 * @constructor
 */
function AssignAppraisalToPost(_threadID, _profileID,_appraisalLevel){
    this.threadID = _threadID;
    this.profileID = _profileID;
    this.appraisalLevel = _appraisalLevel;
}

module.exports = AssignAppraisalToPost;