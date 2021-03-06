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
	var types     = env.statics.types;
	var _SYS      = env.statics.system;
	
	// modules
	var dream     = env.dream;
	var sbx       = env.sbx;
	var factory   = env.dream.factory;
	var util      = factory.utils.util;
	var stringify = env.utils.util.stringify;
	var _         = factory.mods.lodash;
	var promise   = factory.mods.promise;
	
	// factory constants
	var _STAT     = factory.statics.httpStatus;
	var _ERR      = factory.statics.errorCodes;
	

	return function(opts) {
		
		// default the version to 0.0.1
		var version = opts.version || '0.0.1';
		
		return function(args) {
			
			var source, up;
			
			// get the step
			var step = args.step;
			var room = args.parentRun;

			// emit a socket.io message when the step begins
			dream.mods.io.to(room).emit(_SYS.sockets.message, {
				type: _SYS.sockets.stepStart,
				id: args.step.id,
				run: args.stepRun.id
			});
			
			
			// make sure there is a timeout value 0 = no timeout
			step.timeout = !step.timeout ? 0 : step.timeout;
			
			// determine if the activity comes from an activity or from the step itself
			// this is to support one time script-able tasks like conditions or custom tasks
			// that should not be globally accessible
			var activity = step.activity ? step.activity : step;
			var variables = {};
			
			var fetchOpts = {
				version: args.version
			};
				
			if (args.override) {
				fetchOpts.override = args.override;
			}
				
			// get the models
			var models = factory.models(version);
				
			// create a new transaction
			return factory.transaction(function(t) {
				return models.wf_steprun.forge()
				.transaction(t)
				.getResource(args.stepRun.id, _.cloneDeep(fetchOpts))
				.end()
				.then(function(stepRun) {
					
					if (!stepRun) {
						throw 'no step run';
					}
					
					// resolve the parameters into their correct data type
					return promise.each(stepRun.parameters, function(p) {
						
						var datatype = p.parameter.dataType;
						source = datatype.source || 'return value;';
						
						// convert the data to the correct datatype
						return sbx.vm(source, {value: p.value}, datatype.timeout, false).then(function(context) {
							
							// check for a promise response and resolve it
							if (typeof(context.then) === 'function') {
								return context.then(function(context) {
									variables[p.parameter.name] = context._result;
								});
							}
							
							// otherwise set the value
							variables[p.parameter.name] = context._result;
						});
					})
					.then(function() {
						
						if (step.type === types.activity.condition) {
							variables._result = false;
						}
						else {
							variables._result = null;
						}
						
						source = activity.source || 'return null;';

						// run the code through the sandbox
						if (step.type === types.activity.workflow) {
							
							// create a new message body to create a new workflow run
							var msg = {
								params: { 
									id: step.subWorkflow,
									override: args.override || null
								},
								body: {
									input: variables,
									parentStep: args.stepRun.id,
									parentRun: args.parentRun
								},
								fetchOpts: fetchOpts
							};
							
							// create a new workflow run
							return env.workflow.run(msg).then(function(run) {
								
								if (!run) {
									throw 'could not update step run with sub workflow';
								}
								
								// update the step to reflect the workflow run
								return models.wf_steprun.forge()
								.transaction(t)
								.saveResource({
									id: args.stepRun.id,
									subWorkflow: run.id
								}, {idResponse: true})
								.end();
							});
						}
						else if (activity.source) {
							
							// run the source code and handle the output with a promise
							return sbx.vm(source, variables, step.timeout, false).then(function(ctx) {
								var nextStep, status;
									
								// determine the next step and status
								if (ctx._exception) {
									console.log('--EXCEPTION', ctx._exception);
									nextStep = step.exception || step.fail || args.endStep;
									status   = types.status.exception;
								}
								else if (ctx._result === false) {
									console.log('--FAILED or FALSE');
									nextStep = step.fail || args.endStep;
									status   = types.status.fail;
								}
								else {
									nextStep = step.success || args.endStep;
									status   = step.waitOnSuccess ? types.status.waiting : types.status.success;
								}
								
								// get the time
								return factory.time({transacting: t}).then(function(time) {
									
									// calculate how long the activity took in seconds
									var duration = time - args.started;
									duration = (duration <= 0) ? 0 : duration / 1000.0;
			
									// emit a step completion to socket.io
									dream.mods.io.to(room).emit(_SYS.sockets.message, {
										type: _SYS.sockets.stepEnd,
										id: args.step.id,
										run: args.stepRun.id,
										duration: duration,
										status: status
									});
									
									// create a saveData
									var saveData = {
										id: args.stepRun.id,
										status: status
									};
									
									// add the log data if it exists
									if (Array.isArray(ctx._stdout) && ctx._stdout.length > 0) {
										saveData.log = ctx._stdout.join('\n');
										dream.mods.io.to(room).emit(_SYS.sockets.message, {
											type: _SYS.sockets.log,
											id: args.step.id,
											run: args.stepRun.id,
											data: saveData.log
										});
									}
									
									// check if not waiting and update the saveData
									if (status !== types.status.waiting) {
										saveData = _.merge(saveData, {
											completed: time,
											durationSeconds: duration
										});
									}
									
									// update the step status
									return models.wf_steprun.forge()
									.view('output')
									.saveResource(saveData, _.cloneDeep(fetchOpts))
									.end()
									.then(function(results) {
										return results;
									});
								})
								.then(function(result) {
									
									// determine the output updates
									var updates = [];
									_.forEach(result.step.parameters, function(param) {
										
										var id = _.find(args.params, function(val) {
											return param.id === val.parameter.id;
										});
										
										
										
										if (param.type === types.params.output && _.has(ctx, param.name)) {
											updates.push({
												id: id.id,
												value: stringify(ctx[param.name], param.dataType.name),
												step: result.id
											});
											
											if (param.mapAttribute) {

												var map = _.find(args.params, function(val) {
													return val.parameter.id === param.mapAttribute;
												});
												
												if (map) {
													updates.push({
														id: map.id,
														value: stringify(ctx[param.name], param.dataType.name)
													});
												}
											}
										}
									});

									// if there are updates, do them, otherwise return an empty promise
									if (updates.length > 0) {
										up = models.wf_parameterrun.forge()
										.transaction(t)
										.saveResource(updates, {idResponse: true})
										.end();
									}
									else {
										up = util.wrapPromise([]);
									}

									// do the output updates
									return up.then(function() {
										// emit the event if not at the end and not waiting
										if (step.type !== types.activity.end && status !== types.status.waiting) {
											env.dream.emitter.emit(_SYS.events.nextStep, {
												id:        args.id,
												nextStep:  nextStep,
												version:   args.version,
												override:  args.override
											});
										}
										
										// check for end and update the workflow to completed
										if (step.id === args.endStep) {
											
											// run the end
											return env.workflow.end({
												id: args.id,
												wfstarted: args.wfstarted,
												version: args.version,
												override: args.override
											})
											.then(function(result) {
												
												// check for a parent step and resume it
												if (stepRun.workflow.parentStep) {
													
													// compile the log
													var logs = _.pluck(
														_.filter(
															_.sortBy(result.steps, 'started'),
															function(val) {
																return val.log;
															}
														),
														'log'
													).join('\n');
													
													
													env.step.resume(stepRun.workflow.parentStep, result.status, logs, _.cloneDeep(fetchOpts));
												}
												else {
													dream.mods.io.to(room).emit(_SYS.sockets.message, {
														type: _SYS.sockets.end,
														id: args.id,
														status: result.status
													});
												}
												
												return result;
											});
										}
									});
								});
							});
						}
						else {
							env.dream.emitter.emit(_SYS.events.nextStep, {});
						}
					});					
				});
			})
			.then(function(result) {
				return result;
			})
			.caught(function(err) {
				console.log('ERROR', err);
			});
		};
	};
};