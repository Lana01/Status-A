/**
 *
 */

/**
 *
 * @param _from Date
 * @param _to Date
 * @param _appraisalTypeID String
 * @param _spaceID String
 * @constructor
 */
function AppraisalTypeActivation(_from, _to, _appraisalTypeID, _spaceID){
    this.activationPeriod = {from: _from, to: _to};
    this.appraisalTypeID = _appraisalTypeID;
    this.spaceID = _spaceID;
}

modules.exports = AppraisalTypeActivation;