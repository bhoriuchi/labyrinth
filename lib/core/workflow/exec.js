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
			
			// get the step
			var step = args.step;
			
			var variables = {};
			var requested = _.pluck(step.activity.modules, 'name');
			var modules   = env.workflow.modules.allowed(requested);
			
			console.log('REQUESTED MODULES', requested);
			console.log('ALLOWED MODULES', modules);
			
			// function to emit the next step
			var emitNext = function(ctx) {
				
				var nextStep;
				
				if (ctx._exception) {
					console.log('--EXCEPTION', ctx._exception);
					nextStep = step.exception || args.endStep;
				}
				else if (ctx._step_success === false) {
					console.log('--FAILED');
					nextStep = step.fail || args.endStep;
				}
				else {
					nextStep = step.success;
				}
				
				// emit the event
				env.dream.emitter.emit(env.statics.system.events.nextStep, {
					id:        args.id,
					nextStep:  nextStep,
					version:   args.version,
					params:    args.params,
					startStep: args.startStep,
					endStep:   args.endStep
				});
			};
			
			
			// look for an end activity
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
					
					variables[param.name] = input.value;
				}
			});
			
			
			// run the code through the sandbox
			env.sbx.vm(step.activity.source, modules, variables, emitNext, 1000);
		};
	};
};