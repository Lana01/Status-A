/**
 * Created by Abrie on 2015/03/26.
 */
/**
 *
 * @param _name
 * @param _description
 * @param _notRatedIcon
 * @param _availableFrom
 * @param _availableTo
 * @param _AppraisalLevelList
 * @constructor
 */
function AppraisalType(_name, _description, _notRatedIcon, _availableFrom, _availableTo, _AppraisalLevelList){
    this.name = _name;
    this.description = _description;
    this.notRatedIcon = _notRatedIcon;
    this.activityPeriod = {from:new Date(_availableFrom),to: new Date(_availableTo)};
    this.appraisalLevels = _AppraisalLevelList; //This is an ordered list of AppraisalLevel objects
}

module.exports.AppraisalType = AppraisalType;