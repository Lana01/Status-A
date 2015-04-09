/**
 * This module contains all the database schemas used within the BuzzStatus subsystem
 */
var mongoose = require('mongoose');

statusSchema = mongoose.Schema({
    profileID   : mongoose.Schema.Types.ObjectId,
    statusValue : Number
}, { collection : 'Statuses'});

spaceAssessorSchema = mongoose.Schema({
    spaceID             : String,
    profileAssessorID   : String
}, { collection         : 'Spaces_Assessors'});

profileSchema = mongoose.Schema({
    userId      : String,
    moduleId    : String
}, { collection : 'Profiles'});

//TODO data should be of type Buffer; keeping it as String for testing
//TODO It is unclear whether Appraisal Types and their Levels have unique names; using object IDs instead
appraisalLevelSchema = mongoose.Schema({
    name            : String,
    rating          : Number,
    appraisalType   : mongoose.Schema.Types.ObjectId,
    icon:{
        data        : Buffer,
        contentType : String
    }
}, {collection      : 'Appraisal_Levels'});

//TODO data should be of type Buffer; keeping it as String for testing
//TODO Appraisal Level and Type reference each other (as per spec); don't yet see the use of that
appraisalTypeSchema = mongoose.Schema({
    name            : String,
    description     : String,
    notRatedIcon:{
        data        : String,
        contentType : String
    },
    appraisalLevelIDs: [mongoose.Schema.Types.ObjectId]
}, {collection      : 'Appraisal_Types'});

appraisalSchema = mongoose.Schema({
    threadID        : mongoose.Schema.Types.ObjectId,
    profileID       : mongoose.Schema.Types.ObjectId,
    appraisalLevelID: mongoose.Schema.Types.ObjectId
}, {collection      : 'Appraisals'});

appraisalTypeActivationSchema = mongoose.Schema({
    activationPeriod: {
        from        : Date,
        to          : Date
    },
    appraisalType   : mongoose.Schema.Types.ObjectId,
    spaceID         : String
}, {collection      : 'Appraisal_Type_Activations'});


module.exports.statusSchema = statusSchema;
module.exports.spaceAssessorSchema = spaceAssessorSchema;
module.exports.profileSchema = profileSchema;
module.exports.appraisalLevelSchema = appraisalLevelSchema;
module.exports.appraisalTypeSchema = appraisalTypeSchema;
module.exports.appraisalSchema = appraisalSchema;
module.exports.appraisalTypeActivationSchema = appraisalTypeActivationSchema;

exports['@require'] = ['statusSchema'];
exports['@require'] = ['spaceAssessorSchema'];
exports['@require'] = ['profileSchema'];
exports['@require'] = ['appraisalLevelSchema'];
exports['@require'] = ['appraisalTypeSchema'];
exports['@require'] = ['appraisalSchema'];
exports['@require'] = ['appraisalTypeActivationSchema'];