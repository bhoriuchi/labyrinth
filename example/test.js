

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
		cors: {}
	}
};


var labyrinth = require('../lib/labyrinth')(config);
var _         = labyrinth.dream.mods.lodash;


labyrinth.setup.install().then(function() {
	//console.log('Created routes', _.uniq(_.pluck(labyrinth.routes, 'route.path')));
	
	labyrinth.run(labyrinth.routes);
	
});