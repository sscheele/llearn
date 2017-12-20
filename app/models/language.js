const mongoose = require('mongoose');

let languageSchema = mongoose.Schema({
    name: String,
    learning: Number,
    modules: [{type: mongoose.Schema.Types.ObjectId, ref: 'Module'}]
});

module.exports = mongoose.model('Language', languageSchema);