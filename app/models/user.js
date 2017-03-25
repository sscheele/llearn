// load the things we need
var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

// define the schema for our user model
var userSchema = mongoose.Schema({
    local            : {
        email        : String,
        password     : String,
    },
    profile : {
        screenName : String,
        reputation : Number,
        classes : [Object],
        contributions : [Object],
        requests : [Object],
        friends : [String],
    },
    chat : {
        chats : [Object], //each object in chats contains an element saying who the chat is with and an array of message objects
        //each message object contains a time and some text
    }
});

// generating a hash
userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};

// create the model for users and expose it to our app
module.exports = mongoose.model('User', userSchema);