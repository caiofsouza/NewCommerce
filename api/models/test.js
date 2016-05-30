var mongoose = require('mongoose');

module.exports = function(req, res, next){
	return res.status(200).send({message: "deu certo :D"});
};