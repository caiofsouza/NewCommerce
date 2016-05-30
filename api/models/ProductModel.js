var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ProductSchema = new Schema({
	_id: String,
    name: String,
    code: String,
    description: String
});

module.exports = mongoose.model('Product', ProductSchema);