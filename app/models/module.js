var mongoose = require('mongoose');

var moduleSchema = mongoose.Schema({
        name: String,
        description: String,
        rating: Number,
        author: String,
        updated: String,
        pages: [Object],
        comments: [Object],
});

module.exports = mongoose.model('Module', moduleSchema);