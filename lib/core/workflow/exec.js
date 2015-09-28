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
			
			var nextStep;
			
			// get the step
			var step = args.step;
			
			// create a context with standard modules and values
			var context = {
				console: console,
				_step_success: false,
				_step_exception: null
			};
			
			// add the defined context added through the context function
			// it will be available to the vm as the _imports object
			context._imports = env.context;

			
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
					
					context[param.name] = input.value;
				}
			});
			
			
			// wrap the source code in a try/catch to report errors or success
			var source = ' ' +
				'try { ' +
				step.activity.source +
				'    _step_success = true;' +
				'} ' +
				'catch(err) {' +
				'    _step_exception = err;' +
				'}';
			
			
			// try to run the code
			try {
				
				console.log('RUNNING', source);
				
				var script = env.vm.createScript(source);
				script.runInNewContext(context);
				
				
				if (context._step_exception) {
					console.log('--EXCEPTION', context._step_exception);
					nextStep = step.exception || args.endStep;
				}
				else if (context._step_success === false) {
					console.log('--FAILED');
					nextStep = step.fail || args.endStep;
				}
				else {
					console.log('--SUCCESS');
					nextStep = step.success;
				}
				
				// emit the event
				env.dream.emitter.emit(env.statics.system.events.nextStep, {
					id:        args.id,
					nextStep:  nextStep,
					version:   args.version || null,
					params:    args.params,
					startStep: args.startStep,
					endStep:   args.endStep
				});
			}
			catch(err) {
				
				console.log('--EXCEPTION');
				
				// emit the event
				env.dream.emitter.emit(env.statics.system.events.nextStep, {
					id:        args.id,
					nextStep:  step.exception || args.endStep,
					version:   args.version || null,
					params:    args.params,
					startStep: args.startStep,
					endStep:   args.endStep
				});
			}
		};
	};
};