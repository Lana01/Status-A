/**
 * This module contains all the database schemas used within the BuzzStatus subsystem
 */

module.exports = function(mongoose) {
    var statusSchema = mongoose.Schema({
        profileID: mongoose.Schema.Types.ObjectId,
        statusValue: Number
    }, {collection: 'Statuses'});

    var spaceAssessorSchema = mongoose.Schema({
        spaceID: String,
        profileAssessorID: String
    }, {collection: 'Spaces_Assessors'});

    var profileSchema = mongoose.Schema({
        userId: String,
        moduleId: String
    }, {collection: 'Profiles'});

    //TODO data should be of type Buffer; keeping it as String for testing
    //TODO It is unclear whether Appraisal Types and their Levels have unique names; using object IDs instead
    var appraisalLevelSchema = mongoose.Schema({
        name: String,
        rating: Number,
        appraisalType: mongoose.Schema.Types.ObjectId,
        icon: {
            data: Buffer,
            contentType: String
        }
    }, {collection: 'Appraisal_Levels'});

    //TODO data should be of type Buffer; keeping it as String for testing
    //TODO Appraisal Level and Type reference each other (as per spec); don't yet see the use of that
    var appraisalTypeSchema = mongoose.Schema({
        name: String,
        description: String,
        notRatedIcon: {
            data: String,
            contentType: String
        },
        appraisalLevelIDs: [mongoose.Schema.Types.ObjectId]
    }, {collection: 'Appraisal_Types'});

    var appraisalSchema = mongoose.Schema({
        threadID: mongoose.Schema.Types.ObjectId,
        profileID: mongoose.Schema.Types.ObjectId,
        appraisalLevelID: mongoose.Schema.Types.ObjectId
    }, {collection: 'Appraisals'});

   var  appraisalTypeActivationSchema = mongoose.Schema({
        activationPeriod: {
            from: Date,
            to: Date
        },
        appraisalType: mongoose.Schema.Types.ObjectId,
        spaceID: String
    }, {collection: 'Appraisal_Type_Activations'});


    var schemas = module.exports;
    schemas.statusSchema = statusSchema;
    schemas.spaceAssessorSchema = spaceAssessorSchema;
    schemas.profileSchema = profileSchema;
    schemas.appraisalLevelSchema = appraisalLevelSchema;
    schemas.appraisalTypeSchema = appraisalTypeSchema;
    schemas.appraisalSchema = appraisalSchema;
    schemas.appraisalTypeActivationSchema = appraisalTypeActivationSchema;
    return schemas;
};