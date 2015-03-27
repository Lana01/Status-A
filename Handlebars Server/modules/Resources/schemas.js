/**
 * Created by Paul on 2015/03/23.
 */

var schemas = module.exports = {};

schemas.resourceSchema = mongoose.Schema({

    file_name : String,
    data : Buffer,
    hidden : Boolean,
    postID : Number
}, {collection: 'Resources'});

schemas.constraintSchema = mongoose.Schema({

    //_id : mongoose.Schema.Types.ObjectId,
    mime_type : String,
    size_limit : Number
}, {collection: 'Resource_Constraints'});