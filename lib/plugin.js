/**
 * Gets the plugin configuration for the middleware function being executed.
 * @param req the HTTP request
 * @param cb the callback function
 * @returns the plugin configuration from the aggregated dromedary file, or moves to next function in middleware
 */
function cfg(req, cb) {
    var routes = DF['routes'];
    for(var i = 0; i < routes.length; i++){
        if(routes[i].path === req.baseUrl){
            var pluginPosition = _pluginPosition(req);
            var cfg = routes[i]['flow'][pluginPosition];

            /* If the current position belongs to a composite plugin, it is required to skip that position (composite
             * plugin is not part of the middleware) */
            if(_isCompositePlugin(cfg.name)){
                pluginPosition = _pluginPosition(req);
                cfg = routes[i]['flow'][pluginPosition];
            }

            /* Checks all the conditions required to execute a plugin. If any of the conditions are evaluated to false
             * then moves to next middleware function without executing plugin implementation */
            if(_areAllConditionsPassed(cfg, req)){
                return cfg;
            } else {
                return cb();
            }
        }
    }

}

/**
 * Evaluated all the comma separated conditions from the plugin configuration. If any of the conditions is evaluated
 * as not true, returns false and skips middleware function execution.
 * @param cfg the plugin configuration
 * @param req the HTTP request
 * @returns {boolean} TRUE if all conditions are evaluated as TRUE, otherwuse FALSE
 * @private
 *
 * !Note Do not remove req; its used at condition evaluation
 */
function _areAllConditionsPassed(cfg, req){
    if(cfg.conditions){
        var conditions = cfg.conditions.split(",");
        for(var i = 0; i < conditions.length; i++){
            if(eval(DF['conditions'][conditions[i]]) != true) return false;
        }
        return true;
    } else {
        return true;
    }
}

/**
 * Cehcks if the name of the plugin is composite
 * @param pluginName the plugin name evaluated
 * @returns {boolean} TRUE if its equal to composite, otherwise FALSE
 * @private
 */
function _isCompositePlugin(pluginName){
    return pluginName === "composite";
}

/**
 * Determines the position of the plugin configuration
 * @param req the HTTP request
 * @returns {number} the position of the current plugin
 * @private
 */
function _pluginPosition(req) {
    if(req.____ === undefined){
        req.____ = 0;
        return req.____;
    }
    return ++req.____;
}

/**
 * Saves data in request memory space.
 * @param req the HTTP request
 * @param data the data to be saved in request memory space
 * @param dataKey the data key
 */
function saveData(req, data, dataKey){
    req['____' + dataKey] = data;
}

/**
 * Gets data from request memory space
 * @param req the HTTP request
 * @param dataKey the data key
 * @returns {*} the data from request memory space
 */
function getData(req, dataKey){
    return req['____' + dataKey];
}


/**
 * Public Interface
 * @type {{cfg: cfg, saveData: saveData, getData: getData}}
 */
module.exports = {
  cfg : cfg,
  saveData : saveData,
  getData : getData
};