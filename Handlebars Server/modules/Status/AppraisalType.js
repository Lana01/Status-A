/**
 *
 */
/**
 *
 * @param _name String
 * @param _description String
 * @param _notRatedIcon Buffer
 * @param _AppraisalLevelList Array
 * @constructor
 */
function AppraisalType(_name, _description, _notRatedIcon, _AppraisalLevelList){
    this.name = _name;
    this.description = _description;
    this.notRatedIcon = _notRatedIcon;
    this.appraisalLevels = _AppraisalLevelList; //This is an ordered list of AppraisalLevel objects
}

module.exports = AppraisalType;