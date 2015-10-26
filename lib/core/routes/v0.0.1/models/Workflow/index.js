/**
 * Workflow Model
 * @name workflow
 * @extends ManagedEntity
 * 
 * @author Branden Horiuchi <bhoriuchi@gmail.com>
 * @version 0.0.1
 * 
 */
module.exports = function (env) {
	
	var type = env.schemer.constants.type;

	return {
        _model: {
        	name: 'workflow'
        },
        description: {
        	type: type.text,
        	textType: 'mediumtext',
        	nullable: true,
        	views: ['load']
        },
        parameters: {
        	hasMany: 'wf_parameter',
        	nullable: true,
        	versioned: true,
        	views: ['load', 'run']
        },
        steps: {
        	hasMany: 'wf_step',
        	connectRelation: 'workflow',
        	versioned: true,
        	views: ['load', 'next']
        },
		ui: {
			type: type.string,
			nullable: true,
			versioned: true,
			views: ['load']
		},
        _rest: {
        	methods: {
        		GET: {
                    handler: {
                    	useDefaults: true,
                    	routes: [
                    	    {
                    	    	route: '/:id/runs',
                    	    	handler: function(req, res, next) {
                    	    		res.send({message: 'get all workflow runs'});
                    	    		return next();
                    	    	}
                    	    },
                    	    {
                    	    	route: '/:id/runs/:runId',
                    	    	handler: function(req, res, next) {
                    	    		res.send({message: 'get a specific workflow run ' + req.params.runId});
                    	    		return next();
                    	    	}
                    	    }
                    	]
                    }
        		},
        		POST: {
                    handler: {
                    	useDefaults: false,
                    	routes: [
                    	    {
                    	    	route: '/:id/runs',
                    	    	handler: env.workflow.run
                    	    },
                    	    {
                    	    	route: '',
                    	    	handler: env.workflow.create
                    	    }
                    	]
                    }
        		},
        		DELETE: {
        			handler: {
        				useDefaults: false,
        				routes: []
        			}
        		}
        	}
        }
    };
};