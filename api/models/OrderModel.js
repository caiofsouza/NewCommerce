var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var deepPopulate = require('mongoose-deep-populate')(mongoose);

var OrderSchema = new Schema({
   user: { type: Schema.Types.ObjectId, ref: "User" },
   products: [
      { 
         item: { type: Schema.Types.ObjectId, ref: 'Product' },  
         amount: Number
      },

   ],
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
      'user',
      'products.item'
   ]
});

module.exports = mongoose.model('Order', OrderSchema);



