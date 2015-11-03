/**
 * Creates executes the next step in the workflow
 * @name run
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
			
			var nextStep, startStep, endStep, step, params;
			var wfstarted, activity, parentStep, override, wfVersion;
			
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

				// get the workflow
				return models.wf_workflowrun.forge()
				.transaction(t)
				.view('next')
				.getResource(args.id, _.cloneDeep(fetchOpts))
				.end()
				.then(function(run) {
					
					// validate that there is a result
					if (run) {

						// try to parse the override
						try {
							override = JSON.parse(run.override);
						}
						catch (err) {
							override = null;
						}
						
						
						// save the parameters
						params     = run.parameters;
						wfVersion  = run.workflowVersion;
						
						// get the start time
						wfstarted  = run.started;
						parentStep = run.parentStep;
						
						// get the start and end steps. these will be used by the
						// workflow in the absence of a currentStep and fail/exception step
						startStep = _.find(run.workflow.steps, function(step) {
							return step.type === types.activity.start;
						});
						endStep   = _.find(run.workflow.steps, function(step) {
							return step.type === types.activity.end;
						});
						
						// check if the current step is null
						if (run.currentStep === null) {
							
							// find the start step
							step = startStep;
						}
						else {
							// find the current step
							step = _.find(run.workflow.steps, function(step) {
								return step.id === args.nextStep;
							});
						}
						
						// set the step to the end if null
						nextStep = step ? step.id : endStep.id;

						// get the time
						return factory.time({transacting: t}).then(function(timestamp) {
							
							// create an execution for the next step
							return models.wf_steprun.forge()
							.transaction(t)
							.saveResource({
								workflow: args.id,
								step: nextStep,
								started: timestamp,
								status: types.status.running,
								current: args.id
							}, _.cloneDeep(fetchOpts))
							.end()
							.then(function(step) {

								// save the current step id to the workflow
								// and update the status to running
								return models.wf_workflowrun.forge()
								.transaction(t)
								.saveResource({
									id: args.id,
									currentStep: step.id,
									status: types.status.running
								})
								.end()
								.then(function() {
									
									// determine any input mappings and update them
									var inputs = _.remove(_.map(params, function(param, idx) {
										
										if (param.parameter.type === types.params.input &&
												param.parameter.step.id === step.step.id) {
											
											if (param.parameter.mapAttribute) {
												var val = null;
												for (var i = 0; i < params.length; i++) {
													if (params[i].parameter.id === param.parameter.mapAttribute) {
														val = params[i].value;
														break;
													}
												}

												return {
													id: param.id,
													value: val,
													step: step.id
												};
											}
											else {
												return {
													id: param.id,
													step: step.id
												};
											}
										}
										return null;
									}), null);
									
									
									return models.wf_parameterrun.forge()
									.transaction(t)
									.saveResource(inputs)
									.end()
									.then(function() {
										return step;
									});
								});
							});
						});
					}
				});
			})
			.then(function(res) {
				
				// execute the workflow
				env.workflow.exec({
					id:         args.id,         // id of the workflow run
					step:       res.step,        // the step run
					parentStep: parentStep,
					wfstarted:  wfstarted,       // when the workflow started
					started:    res.started,     // when the step started
					version:    wfVersion,       // version of the workflow to run
					params:     params,          // current parameters
					startStep:  startStep.id,    // start step of the workflow
					endStep:    endStep.id,      // end step of the workflow
					stepRun:    res,             // current step run running
					override:   override
				});
				
				// return the result
				return res;
			})
			.caught(function(err) {
				console.log('ERROR', err);
			});
		};
	};
};