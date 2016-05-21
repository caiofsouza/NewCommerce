var express = require('express');
var bodyParser = require('body-parser');

var app = express();

app.set('port', (process.env.PORT || 8000));
app.use(express.static(__dirname + '/public'));
app.set('views', __dirname + '/public/views');
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.use(bodyParser.urlencoded({		
  	extended: true
}));

app.use(bodyParser.json());

app.use('/js', express.static(__dirname + '/js'));
app.use('/views', express.static(__dirname + '/../dist'));
app.use('/css', express.static(__dirname + '/css'));

app.get( '*', function( req, res ) {
    res.sendFile( __dirname + '/public/index.html' );
} );

app.listen(app.get('port'), function() {
	console.log("listen 8000!");
});