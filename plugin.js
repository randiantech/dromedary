function _tick(req) {
    if(req.____ === undefined) return req.____ = 0;
    return ++req.____;
}

function cfg(req) {
    var name = Object.keys(DF['routes'][req.baseUrl]['flow'])[_tick(req)];
    return DF['routes'][req.baseUrl]['flow'][name];
}

module.exports = {
  cfg : cfg
};