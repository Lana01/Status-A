/**
 * Created by Lana on 26/03/2015.
 */
function assignAppraisalToPost(assignAppraisalToPostRequest)
{
    assignAppraisalToPost(assignAppraisalToPostRequest.apprID,assignAppraisalToPostRequest.threadID);
    return assignAppraisalToPostResult;
}

function getAppraisalsForPost(threadID)
{
    var mongoose = require('mongoose');
    mongoose.connect('mongodb://45.55.154.156:27017/Buzz');
    var db = mongoose.connection;
    /*appraisals was previously Appraisal_Threads, but that is now removed from the database
     */
    var link = db.collection('Appraisals').find({threadID:threadID});
    var appraisalTypes = db.getCollection('Appraisals').find({threadID:threadID}, {appraisalLevel:1, _id:0})
    return appraisalTypes;
}