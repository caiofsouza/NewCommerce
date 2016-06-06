var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CategorySchema = new Schema({
    name: String,
    sub_cat: [{ _id: Schema.Types.ObjectId, name: String, sub_cat: [] }]
});

module.exports = mongoose.model('Category', CategorySchema);