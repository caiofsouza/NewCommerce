================= FIND ================
=======================================

// orders by date:
db.orders.find({ date: { $gte:"2016-04-10 12:00:00", $lte: "2016-06-10 18:33:00" } });




============== AGGREGATE ==============
=======================================

// aggregate by payment method:
db.orders.aggregate([ { $group: {  _id: "$payment_method", total: { $sum: "$total_value" } } } ]);

// aggregate with products and user:
db.orders.aggregate([ 
	{ $unwind: '$products' },
	{ $lookup: 
		{ from: "products", localField: "products.item" , foreignField: "_id", as: "productsOrder" },
	},
	{ $unwind: '$user' },
	{ $lookup: 
		{ from: "users", localField: "user", foreignField: "_id", as: "user" }
	}
]);

