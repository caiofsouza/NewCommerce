var jwt = require('jwt-simple'), 
    moment = require('moment'), 
    segredo = '3e00e9485012252c3212df44549b0b01';
    mongoose = require('mongoose');

module.exports = function(req, res) {
    var username = req.body.username || '';
    var password = req.body.password || '';
    if (username == '' || password == '') {
        return res.status(400).send({error: 'Dados vazios!'});
    }


    if(username == 'caiosouza' && password == '1234'){
        
        var user = {
            email: "caio_fsouza@hotmail.com",
            id: 123
        };

        
        var expires = moment().add(7, 'days').valueOf();
        var token = jwt.encode({
            iss: user.id,
            exp: expires
        }, segredo);

        
        return res.status(200).send({
            token: token,
            expires: expires,
            user: user
        });
        
    }else{

        return res.status(400).send({error: 'Dados incorretos!'});

    }


};