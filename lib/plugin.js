function _isComposite(pluginName){
    return pluginName === "composite";
}

function _tick(req) {
    if(req.____ === undefined){
        req.____ = 0;
        return req.____;
    }
    return ++req.____;
}

function _isAllConditionsPassed(cfg, req){
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

function cfg(req, cb) {
    var routes = DF['routes'];
    for(var i = 0; i < routes.length; i++){
        if(routes[i].path === req.baseUrl){
            var tick = _tick(req);
            var cfg = routes[i]['flow'][tick];
            if(_isComposite(cfg.name)){
                tick = _tick(req);
                cfg = routes[i]['flow'][tick];
            }
            console.log("tick:" + tick);
            if(_isAllConditionsPassed(cfg, req)){
                return cfg;
            } else {
                return cb();
            }
        }
    }

}

function saveData(req, data, dataKey){
    req['____' + dataKey] = data;
}

function getData(req, dataKey){
    return req['____' + dataKey];
}

/**
function cb(req, cfg){
    if(cfg.if){
        Object.keys(cfg.if).forEach(function(cond){
            if(!eval(cond))
                })
    }
    return cb();
}**/

module.exports = {
  cfg : cfg,
  saveData : saveData,
  getData : getData
};