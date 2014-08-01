// server.js

// BASE SETUP
// =============================================================================

// call the packages we need
var express    = require('express'); 		// call express
var app        = express(); 				// define our app using express
var bodyParser = require('body-parser');

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser());

var port = process.env.PORT || 8080; 		// set our port

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router(); 				// get an instance of the express Router

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.route('/tasks')

	// create a bear (accessed at POST http://localhost:8080/api/bears)
	.post(function(req, res) {

		var bear = new Bear(); 		// create a new instance of the Bear model
		bear.name = req.body.name;  // set the bears name (comes from the request)

		// save the bear and check for errors
		bear.save(function(err) {
			if (err)
				res.send(err);

			res.json({ message: 'Bear created!' });
		});

	})

    .get(function(req, res) {
        res.json([
            {
                name: "Do something",
                id: 1
            },
            {
                name: "Do something else",
                id: 2
            }
        ]);
//		Bear.find(function(err, bears) {
//			if (err)
//				res.send(err);
//
//			res.json(bears);
//		});
	});


router.route('/tasks/:bear_id')

	// get the bear with that id (accessed at GET http://localhost:8080/api/bears/:bear_id)
	.get(function(req, res) {
		Bear.findById(req.params.bear_id, function(err, bear) {
			if (err)
				res.send(err);
			res.json(bear);
		});
	})

    // update the bear with this id (accessed at PUT http://localhost:8080/api/bears/:bear_id)
	.put(function(req, res) {

		// use our bear model to find the bear we want
		Bear.findById(req.params.bear_id, function(err, bear) {

			if (err)
				res.send(err);

			bear.name = req.body.name; 	// update the bears info

			// save the bear
			bear.save(function(err) {
				if (err)
					res.send(err);

				res.json({ message: 'Bear updated!' });
			});

		});
	})

    // delete the bear with this id (accessed at DELETE http://localhost:8080/api/bears/:bear_id)
	.delete(function(req, res) {
		Bear.remove({
			_id: req.params.bear_id
		}, function(err, bear) {
			if (err)
				res.send(err);

			res.json({ message: 'Successfully deleted' });
		});
	});

// more routes for our API will happen here
app.get('/', function(req, res) {
    res.sendfile('index.html');
});


// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);
app.use(express.static(__dirname + '/public'));

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);
