/**
 *
 */

/**
 *
 * @param _ThreadID TODO not final, either thread or post id
 * @param _AppraisalLevelID
 * @param _ProfileID
 * @constructor
 */
function Appraisal(_ThreadID, _AppraisalLevelID,_ProfileID){
    this.threadID = _ThreadID;
    this.appraisalLevelID = _AppraisalLevelID;
    this.profileID = _ProfileID;
}

modules.exports = Appraisal;