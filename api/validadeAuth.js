var jwt = require('jwt-simple'),
    segredo = '3e00e9485012252c3212df44549b0b01';

module.exports = function(req, res, next) {
    var token = (req.body && req.body.access_token) || 
                (req.query && req.query.access_token) || 
                req.headers['x-access-token'];

    if (token) {
        try {
            var decoded = jwt.decode(token, segredo);
            console.log(decoded);

            if (decoded.exp <= Date.now()) {
                res.json(400, {error: 'Acesso Expirado, faça login novamente'});
            }

            var user = {
                email: "caio_fsouza@hotmail.com",
                id: 123,
                password: 123
            };

            req.user = user;
            console.log('achei usuario ' + req.user);
            return next();
        //4
        } catch (err) {
            return res.status(401).json({message: 'Erro: Seu token é inválido'});
        }
    } else {
        res.json(401, {message: 'Token não encontrado ou informado'})
    }
};