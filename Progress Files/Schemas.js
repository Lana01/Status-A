/**
 * Created by Abrie van Aardt on 2015/03/24.
 * This module contains all the database schemas used within the Status subsystem
 */
var mongoose = require('mongoose');

statusSchema = mongoose.Schema({
    profileID   : mongoose.Schema.Types.ObjectId,
    statusValue : Number
}, { collection : 'Statuses'});

spaceAssessorSchema = mongoose.Schema({
    spaceID   : String,
    profileAssessorID : String
}, { collection : 'Spaces_Assessors'});

profileSchema = mongoose.Schema({
    userId      : String,
    moduleId    : String
}, { collection : 'Profiles'});

//TODO It is unclear whether Appraisal Types and their Levels have unique names; using object IDs instead
appraisalLevelSchema = mongoose.Schema({
    name: String,
    rating: Number,
    appraisalType: mongoose.Schema.Types.ObjectId,
    icon:{
        data: Buffer,
        contentType: String
    }
});

appraisalTypeSchema = mongoose.Schema({
    name: String,
    description: String,
    notRatedIcon:{
        data: Buffer,
        contentType: String
    },
    appraisalLevelIDs: [mongoose.Schema.Types.ObjectId]
});

appraisalSchema = mongoose.Schema({
    threadID: mongoose.Schema.Types.ObjectId,
    profileID: mongoose.Schema.Types.ObjectId,
    appraisalLevelID: mongoose.Schema.Types.ObjectId
});

appraisalTypeActivationSchema = mongoose.Schema({
    activationPeriod: {
        from: Date,
        to: Date
    },
    appraisalType: mongoose.Schema.Types.ObjectId,
    spaceID: String
});


module.exports.statusSchema = statusSchema;
module.exports.spaceAssessorSchema = spaceAssessorSchema;
module.exports.profileSchema = profileSchema;
module.exports.appraisalLevelSchema = appraisalLevelSchema;
module.exports.appraisalTypeSchema = appraisalTypeSchema;
module.exports.appraisalSchema = appraisalSchema;
module.exports.appraisalTypeActivationSchema = appraisalTypeActivationSchema;