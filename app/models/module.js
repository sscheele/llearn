var mongoose = require('mongoose');

var moduleSchema = mongoose.Schema({
    name: String,
    rating : Number,
    author : String,
    updated : String,
    pages : [Object],
    comments : [Object],
});

module.exports = mongoose.Model('Module', moduleSchema);