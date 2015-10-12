function _tick(req) {
    if(req.____ === undefined) return req.____ = 0;
    return ++req.____;
}

function cfg(req) {
    var name = Object.keys(DF['routes'][req.baseUrl]['flow'])[_tick(req)];
    return DF['routes'][req.baseUrl]['flow'][name];
}

function saveData(req, data, dataKey){
    req['____' + dataKey] = data;
}

function getData(req, dataKey){
    return req['____' + dataKey];
}

module.exports = {
  cfg : cfg,
  saveData : saveData,
  getData : getData
};