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
	var errors  = env.statics.errorCodes;
	
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
			
			// create a new workflow payload with start and end steps
			var workflow = {
				steps: [
				    {
				    	label: 'Start',
				    	type: types.activity.start,
				    	activity: _SYS.id.startActivity,
				    	ui: JSON.stringify({
				    		top: 5100,
				    		left: 5100
				    	})
				    },
				    {
				    	label: 'End',
				    	type: types.activity.end,
				    	activity: _SYS.id.endActivity,
				    	ui: JSON.stringify({
				    		top: 5100,
				    		left: 5250
				    	})
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
				
				var activity;
				
				// save the workflow
				return models.wf_workflow.forge()
				.transaction(t)
				.saveResource(workflow)
				.end()
				.then(function(wf) {
					
					if (!wf) {
						throw  util.newErr(
							_STAT.NO_CONTENT.code,
							errors.COULD_NOT_CREATE.message,
							errors.COULD_NOT_CREATE.code,
							['The workflow was not created']
						);
					}
					
					// get the end step
					var endStep   = _.find(wf.steps, function(step) {
						activity = step.activity ? step.activity : step;
						return activity.type === types.activity.end;
					});
					
					// set the start and end step success to the end step
					for (var i = 0; i < wf.steps.length; i++) {
						var step = wf.steps[i];
						activity = step.activity ? step.activity : step;
						
						if (activity.type === types.activity.start) {
							wf.steps[i] = {
								id: step.id,
								success: endStep.id
							};
						}
						else if (activity.type === types.activity.end) {
							wf.steps[i] = {
								id: step.id,
								success: endStep.id
							};
						}
					}
					
					// save the relationships and return the updated workflow
					return models.wf_workflow.forge()
					.transaction(t)
					.saveResource({
						id: wf.id,
						steps: wf.steps
					})
					.end()
					.then(function(wf) {
						
						if (!wf) {
							throw  util.newErr(
								_STAT.NO_CONTENT.code,
								errors.COULD_NOT_UPDATE.message,
								errors.COULD_NOT_UPDATE.code,
								['Could not connect the workflow steps']
							);
						}
						
						return wf;
					});
				});
			})
			
			// send updated workflow as a response
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