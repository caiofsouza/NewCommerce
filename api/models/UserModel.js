var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var Schema = mongoose.Schema;
var SALT_WORK_FACTOR = 10;

var UserSchema = new Schema({
    name: String,
    facebook_id: Number,
    email: String,
    password: String,
    age: Number,
    cover_img: String,
    address: [
        {
            name: String,
            street: String,
            number: Number,
            compl: String,
            city: String,
            state: String,
            country: String
        }
    ],
    favorities: [
        {
            product_id: String,
            path_name: String
        }
    ],
    active: Boolean,
    created_at: String
});

UserSchema.methods.comparePassword = function(checkPassword, callback) {
    bcrypt.compare(checkPassword, this.password, function(err, match) {
        if (err){
        	return callback(err, false);
        }else{
        	callback(null, match);
        }
    });
};

UserSchema.pre('save', function(next) {
    var user = this;

    // only hash the password if it has been modified (or is new)
    if (!user.isModified('password')) return next();

    // generate a salt
    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
        if (err){
            return next(err);
        }
        // hash the password using our new salt
        bcrypt.hash(user.password, salt, function(err, hash) {
            if (err){
                return next(err);
            }

            // override the cleartext password with the hashed one
            user.password = hash;
            next();
        });
    });
});

module.exports = mongoose.model('User', UserSchema);