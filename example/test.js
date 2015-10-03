

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


var dream     = require('dreamcatcher')(config);
var labyrinth = dream.register.plugin('labyrinth', require('../lib/labyrinth'));
var _         = dream.mods.lodash;

labyrinth.modules.set(['console', 'lodash']);
dream.register.middleware(function(req, res, next) {
	console.log('running middleware for ', req.url);
	req.url = (req.url === '/public') ? '/public/index.html' : req.url;
	return next();
});

labyrinth.setup.install().then(function() {
	//console.log('Created routes', _.uniq(_.pluck(labyrinth.routes, 'route.path')));
	var routes = dream.getRoutes();
	
	// push a route to the basic UI
	routes.push(dream.staticRoute({
		path: /\/public\/?.*/,
		directory: __dirname.replace('/example', ''),
		'default': '/index.html'
	}));
	
	dream.run(routes);
	
});