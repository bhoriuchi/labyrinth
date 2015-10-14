

// create a database connection config
var config = {
	database: {
		client: "mysql",
		connection: {
			host: "127.0.0.1",
			user: "db",
			password: "password",
			database: "test",
			charset: "utf8"
		},
		debug: false
	},
	rest: {
		basePath: '/api',
		versions: ['0.0.1'],
		port: 8080,
		cors: {},
		server: {
			name: '[ LABYRINTH ]'
		}
	}
};


// main module setup
var dream      = require('dreamcatcher')(config);
var labyrinth  = dream.register.plugin('labyrinth', require('../lib/labyrinth'));


// allow modules
labyrinth.modules.set(['console', 'lodash']);

labyrinth.setup.install().then(function() {

	// get the routes
	var routes = dream.getRoutes();

	// push a handlebars route for the main ui
	routes.push(dream.hbsRoute({
		path: '/public',
		template: '../public/templates/index.hbs',
		context: {
			'public': '/public'
		},
		live: true
	}));
	
	// push a route for content
	routes.push(dream.staticRoute({
		path: /\/public\/?.*/,
		directory: __dirname.replace('/example', ''),
		'default': 'index.html'
	}));
	
	// run the server
	dream.run(routes);
});