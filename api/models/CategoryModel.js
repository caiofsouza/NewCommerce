var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CategorySchema = new Schema({
    name: String,
    sub_cat: [{ _id: Schema.Types.ObjectId, name: String}]
});

module.exports = mongoose.model('Category', CategorySchema);