

// create a database connection config
var config = {
	"client": "mysql",
	"connection": {
		"host": "127.0.0.1",
		"user": "db",
		"password": "password",
		"database": "test",
		"charset": "utf8"
	},
	debug: false,
	rest: {
		basePath: '/api',
		versions: ['0.0.1'],
		port: 8080,
		cors: {},
		server: {
			name: '-> labyrinth <-'
		}
	}
};

console.log(__dirname);

var dream     = require('dreamcatcher')(config);
var labyrinth = dream.register.plugin('labyrinth', require('../lib/labyrinth'));
var _         = dream.mods.lodash;

labyrinth.context.set({
	console: console
});


labyrinth.setup.install().then(function() {
	//console.log('Created routes', _.uniq(_.pluck(labyrinth.routes, 'route.path')));
	var routes = dream.getRoutes();
	dream.run(routes);
	
});