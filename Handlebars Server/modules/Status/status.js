/*
Created by Renette
This is for the first version of the package since I do not know exactly what you want exported and how.
Feel free to change this.
 */

var files = [];
files.add(require('./ProfileAssessor'));
files.add(require('./Appraisal'));
files.add(require('./AppraisalLevel'));
files.add(require('./AppraisalType'));
files.add(require('./BuzzStatus'));
files.add(require('./ProfileAssessor'));

module.exports = files[0];

for (var i=1; i<files.length; ++i) {
    for (var attr in files[i]) {
        module.exports[attr] = files[i][attr];
    }
}
