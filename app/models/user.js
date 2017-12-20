// load the things we need
var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

// define the schema for our user model
var userSchema = mongoose.Schema({
    local: {
        password: {
            required: true,
            type: String
        }
    },
    profile: {
        email: {
            required: true,
            type: String
        },
        screenName: {
            required: true,
            type: String
        },
        reputation: {
            type: Number,
            default: 0
        },
        classes: [{type: mongoose.Schema.Types.ObjectId, ref: 'Module'}],
        contributions: [{type: mongoose.Schema.Types.ObjectId, ref: 'Module'}],
        requests: [Object],
        friends: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
        knownLanguages: [{type: mongoose.Schema.Types.ObjectId, ref: 'Language'}],
        learningLanguages: [{type: mongoose.Schema.Types.ObjectId, ref: 'Language'}]
    }
});

// generating a hash
userSchema.methods.generateHash = function (password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function (password) {
    return bcrypt.compareSync(password, this.local.password);
};

// create the model for users and expose it to our app
module.exports = mongoose.model('User', userSchema);
