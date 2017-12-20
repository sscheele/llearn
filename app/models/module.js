var mongoose = require('mongoose');

var moduleSchema = mongoose.Schema({
    name: String,
    description: String,
    rating: Number,
    author: String,
    published: Boolean,
    updated: String,
    comments: [{
        user: String,
        text: String
    }],
    pages: Number
});

module.exports = mongoose.model('Module', moduleSchema);