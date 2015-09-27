/**
 * Executes a step
 * @name exec
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
		
		// default the version to 0.0.1
		var version = opts.version || '0.0.1';
		
		return function(args) {
			
			var context = {console: console};
			var step = args.step;
			
			console.log(step.activity.id, _SYS.id.endActivity);
			
			// get the models
			//var models = factory.models(version);
			if (step.activity.id === _SYS.id.endActivity) {
				console.log('ending');
				return false;
			}
			
			
			// look for input
			_.forEach(step.activity.parameters, function(param) {
				if (param.scope === 'input') {
					
					var input = _.find(args.params, function(p) {
						return p.parameter.id === param.id;
					});
					
					context[param.name] = input.value;
				}
			});
			
			
			try {
				
				
				var script = env.vm.createScript(step.activity.source);
				script.runInNewContext(context);
				
				//console.log(args);
				console.log('--SUCCESS');
				
				// emit the event
				env.dream.emitter.emit(env.statics.system.events.nextStep, {
					id: args.id,
					nextStep: step.success,
					version: args.version || null
				});
			}
			catch(err) {
				
				console.log('--FAILED');
				
				console.log(step);
				
				// emit the event
				env.dream.emitter.emit(env.statics.system.events.nextStep, {
					id: args.id,
					nextStep: step.fail,
					version: args.version || null
				});
			}

			

		};
	};
};