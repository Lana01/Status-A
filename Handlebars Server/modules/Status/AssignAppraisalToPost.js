/**
 *
 * @param _threadID String
 * @param _profileID String
 * @param _appraisalLevel String
 * @constructor
 */
function AssignAppraisalToPost(_threadID, _profileID,_appraisalLevel){
    this.threadID = _threadID;
    this.profileID = _profileID;
    this.appraisalLevel = _appraisalLevel;
}

module.exports = AssignAppraisalToPost;