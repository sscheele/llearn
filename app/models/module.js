var mongoose = require('mongoose');

var moduleSchema = mongoose.Schema({
    name: String,
    description: String,
    rating: Number,
    author: String,
    updated: String,
    comments: [Object],
    pages: Number
});

module.exports = mongoose.model('Module', moduleSchema);