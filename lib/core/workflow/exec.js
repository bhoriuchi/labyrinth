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
			
			// get the allowed modules by filtering the requested with the global allowed
			var requested = _.pluck(step.activity.modules, 'name');
			var modules   = env.workflow.modules.allowed(requested);
			
			// function to emit the next step and update the status of the steprun
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
					status   = types.status.fail;
				}
				else {
					nextStep = step.success;
					status   = step.waitOnSuccess ? types.status.waiting : types.status.success;
				}
				
				// emit the event if not at the end and not waiting
				if (step.id !== args.endStep && !step.waitOnSuccess) {
					env.dream.emitter.emit(_SYS.events.nextStep, {
						id:        args.id,
						started:   args.started,
						wfstarted: args.wfstarted,
						nextStep:  nextStep,
						version:   args.version,
						params:    args.params,
						startStep: args.startStep,
						endStep:   args.endStep,
						override:  args.override
					});
				}

				
				// create a new transaction
				return factory.transaction(function(t) {

					// get the time
					return factory.time({transacting: t}).then(function(time) {
						
						// calculate how long the activity took in seconds
						var duration = time - args.started;
						duration = (duration <= 0) ? 0 : duration / 1000.0;
						
						// create a saveData
						var saveData = {
							id: args.stepRun,
							status: status
						};
						
						// check if not waiting and update the saveData
						if (!step.waitOnSuccess) {
							saveData = _.merge(saveData, {
								completed: time,
								durationSeconds: duration
							});
						}
						
						// update the step status
						return factory.models(version).wf_steprun.forge()
						.saveResource(saveData)
						.end()
						.then(function(results) {
				
							
							return results;
						});
					});
				})
				.then(function(result) {
					
					// check for end and update the workflow to completed
					if (step.id === args.endStep) {

						// run the end
						return env.workflow.end({
							id: args.id,
							wfstarted: args.wfstarted
						})
						.then(function(result) {
							return result;
						});
					}
					
					// return the result
					return result;
				})
				.caught(function(err) {
					console.log(err);
				});
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