/**
 * Creates a new step in the workflow
 * 
 * @name create
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
	var filter  = factory.mods.dotprune;
	var promise = factory.mods.promise;
	
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
			var scope, params, type;
			var attrmap = {};
			var attrs   = [];
			var ios     = [];
			
			// update the request body
			if (_.has(req.body, 'activity')) {
				req.body.subWorkflow = null;
				req.body.type = 'activity';
				type = types.scope.activity;
				req.body.type = type;
			}
			else if (_.has(req.body, 'subWorkflow')) {
				req.body.activity = null;
				type = types.scope.workflow;
				req.body.type = type;
			}
			else {
				req.body.activity = null;
				req.body.subWorkflow = null;
				type = types.scope.step;
				req.body.type = type;
			}
			
			// create a new transaction
			return factory.transaction(function(t) {
				
				// first create a new step
				return models.wf_step.forge()
				.transaction(t)
				.saveResource(req.body)
				.end()
				.then(function(step) {
					
					if (!step) {
						throw 'no step';
					}
					
					// get the appropriate params
					if (type === types.scope.activity) {
						params = step.activity.parameters;
					}
					else if (type === types.scope.workflow) {
						params = step.subWorkflow.parameters;
					}
					else {
						params = [];
					}
					
					// filter down to useful data
					params = filter.prune(params, [
					    'id', 'name', 'type', 'mapAttribute',
					    'required', 'defaultValue',
					    'description', 'dataType.id'
					], true);
					
					
					// add step specific data
					_.forEach(params, function(param, idx) {
						
						// add step specific fields
						params[idx].scope    = types.scope.step;
						params[idx].dataType = param.dataType.id;
						params[idx].step     = step.id;
						params[idx].workflow = step.workflow.id;
						
						// push the appropriate attribute
						if (param.type === types.params.attribute) {
							attrs.push(params[idx]);
						}
						else {
							ios.push(params[idx]);
						}
					});
					
					// save the new attributes
					return promise.map(attrs, function(attr) {
						
						var attrId = attr.id;
						delete attr.id;
						
						return models.wf_parameter.forge()
						.transaction(t)
						.saveResource(attr, {idResponse: true})
						.end()
						.then(function(attribute) {
							
							// create a mapping of scope level attributes
							// this will be used to create the same parameter
							// mapping with new objects
							if (attribute) {
								attrmap[attrId] = attribute.id;
							}
						});
					})
					.then(function() {
						console.log(attrmap);
						return promise.map(ios, function(io) {
							
							delete io.id;
							
							if (io.mapAttribute && _.has(attrmap, io.mapAttribute)) {
								io.mapAttribute = attrmap[io.mapAttribute];
							}
							
							return models.wf_parameter.forge()
							.transaction(t)
							.saveResource(io, {idResponse: true})
							.end();
						})
						.then(function() {
							return models.wf_step.forge()
							.transaction(t)
							.getResource(step.id, {version: 0})
							.end()
							.then(function(step) {
								return step;
							});
						});
					});
					
					/*
					return models.wf_parameter.forge()
					.transaction(t)
					.saveResource(params)
					.end()
					.then(function() {
						return models.wf_step.forge()
						.transaction(t)
						.getResource(step.id, {version: 0})
						.end()
						.then(function(step) {
							return step;
						});
					});
					*/
				});
			})
			.then(function(step) {
				res.send(step);
				return next();
			})
			.caught(function(err) {
				console.log(err);
			});
		};
	};
};