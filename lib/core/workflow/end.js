/**
 * Run at the end of the workflow to set status and cleanup
 * @name end
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
	
	
	return function(opts) {
		
		// default the version to 0.0.1 models
		var version = opts.version || '0.0.1';
		
		return function(args) {

			// get the models
			var models = factory.models(version);

			
			// create a new transaction
			return factory.transaction(function(t) {

				// get the time
				return factory.time({transacting: t}).then(function(time) {
					
					// calculate how long the activity took in seconds
					var duration = time - args.wfstarted;
					duration = (duration <= 0) ? 0 : duration / 1000.0;
					
					// get the workflow
					return models.wf_workflowrun.forge()
					.transaction(t)
					.saveResource({
						id: args.id,
						status: types.status.completed,
						completed: time,
						durationSeconds: duration
					})
					.end()
					.then(function(results) {
						return results;
					});
				});
			})
			.then(function(result) {
				// return the result
				return result;
			})
			.caught(function(err) {
				console.log(err);
			});
		};
	};
};