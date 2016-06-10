var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var deepPopulate = require('mongoose-deep-populate')(mongoose);

var OrderSchema = new Schema({
   user_id: { type: Schema.Types.ObjectId, ref: "User" },
   products: [{type: Schema.Types.ObjectId, ref: 'Product' }],
   total_value: Number,
   promotion_code: String,
   total_discounted_value: Number,
   user_address: String,
   payment_method: String,
   status: Number,
   done: Boolean,
   date: String
});

OrderSchema.plugin(deepPopulate, {
   whitelist: [
      'user_id',
      'products'
   ]
});

module.exports = mongoose.model('Order', OrderSchema);



