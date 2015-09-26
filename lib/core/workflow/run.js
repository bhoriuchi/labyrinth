/**
 * Creates a new workflow run
 * @name run
 * 
 * @author Branden Horiuchi <bhoriuchi@gmail.com>
 * @version 0.0.1
 * 
 */
module.exports = function (env) {
	
	// constants
	var types   = env.statics.types;
	
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
		
		// return the handler function
		return function(req, res, next) {
			
			// variable to hold the workflow
			var wf, params;
			params = [];
			
			// parse the query params
			var qsp = env.dream.core.util.qsParse(req);
			
			
			// get the models
			var models = factory.models(version);
			var model  = models.workflow.forge();

			// create a new transaction
			return factory.transaction(function(t) {
				
				// get the workflow
				return models.workflow.forge()
				.transaction(t)
				.getResource(req.params.id, qsp.fetchOpts)
				.end()
				.then(function(results) {
					
					// verify that a workflow was found
					if (results) {
						
						// set the workflow to be referenced later
						wf = results;
											
						// check the body for input
						_.forEach(wf.parameters, function(parameter) {
							
							// check the body for the param
							var hasParam = _.contains(_.keys(req.body), parameter.name);
							
							// check for input
							if (parameter.scope === types.params.input) {
								if (parameter.required && !hasParam) {
									throw util.newErr(
										_STAT.BAD_REQUEST.code,
										_ERR.BAD_REQUEST_BODY.detail,
										_ERR.BAD_REQUEST_BODY.code,
										['Missing required input ' + parameter.name]
									);
								}
								else if (hasParam) {
									
									// push the parameter
									params.push({
										parameter: parameter.id,
										value: req.body[parameter.name]
									});
								}
							}
							else {
								params.push({
									parameter: parameter.id,
									value: parameter.defaultValue
								});
							}
						});
						
						// get the current system time
						return factory.time({transacting: t}).then(function(time) {

							// create a new workflow run
							var payload = {
								started: time,
								status: types.status.queued,
								workflow: wf.id,
								parameters: params
							};
							
							// and save it
							return models.workflowrun.forge()
							.transaction(t)
							.href(qsp.href)
							.view(['id', 'started', 'status'])
							.saveResource(payload)
							.end()
							.then(function(result) {
								return result;
							});
							
						});
					}
					
					// if there were no results, throw an error
					throw util.newErr(
						_STAT.BAD_REQUEST.code,
						_ERR.BAD_REQUEST_BODY.detail,
						_ERR.BAD_REQUEST_BODY.code,
						['The workflow { id: ' + req.params.id + ' } was not found']
					);
				});
			})
			.then(function(results) {
				
				if (util.isErr(results)) {
					res.send(results.code, results);
				}
				else {
					res.send(results);
				}

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