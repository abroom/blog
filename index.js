// server
var express = require('express');
var stormpath = require('express-stormpath');
var pg = require('pg');

var app = express();
app.use(express.static(__dirname + '/public'));
app.use(stormpath.init(app, { website: true }));

app.set('port', (process.env.PORT || 3000));
app.on('stormpath.ready', function() {
	app.listen(app.get('port'), function() {
		console.log('Node app is running on port', app.get('port'));
	});
});

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function(request, response) {
	response.render('pages/index');
});
app.get('/blog', function (request, response) {
	pg.connect(process.env.DATABASE_URL, function(err, client, done) {
		client.query('SELECT * FROM items', function(err, result) {
			done();
			if (err) {
				console.error(err); response.send("Error " + err);
			} else {
				response.render('pages/blog', {results: result.rows} );
			}
		});
	});
});
app.get('/blog/:id', function (request, response) {
	pg.connect(process.env.DATABASE_URL, function(err, client, done) {
		client.query('SELECT * FROM items WHERE id=' + request.params.id, function(err, result) {
			done();
			if (err) {
				console.error(err); response.send("Error " + err);
			} else {
				response.render('pages/blog', {results: result.rows} );
			}
		});
	});
});
// app.get('/blog', stormpath.loginRequired, function (request, response) {
// 	pg.connect(process.env.DATABASE_URL, function(err, client, done) {
// 		client.query('SELECT * FROM items', function(err, result) {
// 			done();
// 			if (err)
// 			 { console.error(err); response.send("Error " + err); }
// 			else
// 			 { response.render('pages/db', {results: result.rows} ); }
// 		});
// 	});
// });
