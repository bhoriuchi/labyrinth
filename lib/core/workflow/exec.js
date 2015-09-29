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
			
			// function to emit the next step
			var emitNext = function(ctx) {
				
				var nextStep, status;
				
				if (ctx._exception) {
					console.log('--EXCEPTION', ctx._exception);
					nextStep = step.exception || args.endStep;
					status   = types.status.exception;
				}
				else if (ctx._step_success === false) {
					console.log('--FAILED');
					nextStep = step.fail || args.endStep;
					status   = types.status.failed;
				}
				else {
					nextStep = step.success;
					status   = step.waitOnSuccess ? types.status.waiting : types.status.successful;
				}
				
				// emit the event if not at the end
				if (step.id !== args.endStep && !step.waitOnSuccess) {
					env.dream.emitter.emit(_SYS.events.nextStep, {
						id:        args.id,
						nextStep:  nextStep,
						version:   args.version,
						params:    args.params,
						startStep: args.startStep,
						endStep:   args.endStep
					});
				}

				
				// update the step status
				return factory.models(version).wf_steprun.forge()
				.saveResource({
					id: args.stepRun,
					status: status
				})
				.end();
			};

			
			// look for input
			_.forEach(step.activity.parameters, function(param) {
				if (param.scope === 'input') {
					
					var input = _.find(args.params, function(p) {
						return p.parameter.id === param.id;
					});
					
					variables[param.name] = input.value;
				}
			});

			// make sure there is a timeout value 0 = no timeout
			step.timeout = !step.timeout ? 0 : step.timeout;
			
			// run the code through the sandbox
			env.sbx.vm(step.activity.source, modules, variables, emitNext, step.timeout);
		};
	};
};