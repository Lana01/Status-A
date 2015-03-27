/**
 *
 */

/**
 *
 * @param _name String
 * @param _rating Integer
 * @param _icon Buffer
 * @constructor
 */
function AppraisalLevel(_name, _rating,_icon){
    this.name = _name;
    this.rating = _rating;
    this.icon = _icon;
}

module.exports = AppraisalLevel;