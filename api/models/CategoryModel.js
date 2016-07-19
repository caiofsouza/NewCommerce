var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CategorySchema = new Schema({
    name: String,
    sub_cats: [{ _id: Schema.Types.ObjectId, name: String, sub_cats: [] }]
});

module.exports = mongoose.model('Category', CategorySchema);