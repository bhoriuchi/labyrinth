/**
 * Creates a new workflow with a name, start, and end step
 * 
 * @name new
 * 
 * @author Branden Horiuchi <bhoriuchi@gmail.com>
 * @version 0.0.1
 * 
 */
module.exports = function (env) {
	
	// constants
	var types   = env.statics.types;
	var _SYS    = env.statics.system;
	
	// modules
	var factory = env.dream.factory;
	var util    = factory.utils.util;
	var _       = factory.mods.lodash;
	
	// factory constants
	var _STAT   = factory.statics.httpStatus;
	var _ERR    = factory.statics.errorCodes;
	var _VER    = factory.statics.version;
	
	
	return function(opts) {
		
		// default the version to 0.0.1
		var version = opts.version || '0.0.1';
		
		// return the handler function
		return function(req, res, next) {

			// get the models
			var models = factory.models(version);
			
			// create a new workflow payload with a start step
			
			var workflow = {
				steps: [
				    {
				    	label: types.activity.start,
				    	activity: _SYS.id.startActivity
				    },
				    {
				    	label: types.activity.end,
				    	activity: _SYS.id.endActivity
				    }				    
				]
			};

			// look for name and description
			if (_.has(req.body, 'name')) {
				workflow.name = req.body.name;
			}
			if (_.has(req.body, 'description')) {
				workflow.description = req.body.description;
			}
			
			
			// create a new transaction
			return factory.transaction(function(t) {
				
				return models.wf_workflow.forge()
				.transaction(t)
				.saveResource(workflow)
				.end()
				.then(function(wf) {
					
					// get the end step
					var endStep   = _.find(wf.steps, function(step) {
						return step.activity.type === types.activity.end;
					});
					
					// set the start step success to the end step
					for (var i = 0; i < wf.steps.length; i++) {
						var step = wf.steps[i];
						
						if (step.activity.type === types.activity.start) {
							wf.steps[i] = {
								id: step.id,
								success: endStep.id
							};
						}
						else if (step.activity.type === types.activity.end) {
							wf.steps[i] = {
								id: step.id,
								success: endStep.id
							};
						}
					}
					
					return models.wf_workflow.forge()
					.transaction(t)
					.saveResource({
						id: wf.id,
						steps: wf.steps
					})
					.end()
					.then(function(wf) {
						return wf;
					});
					
				});
			})
			.then(function(wf) {
				res.send(wf);
				return next();
			})
			.caught(function(err) {
				
				if (util.isErr(err)) {
					res.send(err.code, err);
				}
				else {
					res.send(err);
				}
				return next();
			});
		};
	};
};