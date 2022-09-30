const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        // if you have a validation middleware at some point
        // unique true is not going to be one of them
        unique: true
    } 
});

// this plugin(passportLocalMongoose) is gonna to add on to our schema a username,
// it's going to add on a field for password
UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', UserSchema);

