var cfg = require("../plugin.js").cfg;

/**
 * set_request_header plugin for Dromedary library.
 * Sets the given header in the HTTP request
 * @param req the HTTP request
 * @param res the HTTP response
 * @param cb the callback function
 */
function plugin(req, res, cb) {
    console.log("->set request header");
    var _ = cfg(req);
    Object.keys(_['header']).forEach(function (headerName) {
        req.headers[headerName] = _['header'][headerName];
    });
    cb();
}

/**
 * Public Inteface
 * @type {{plugin:plugin}}
 */
module.exports = {
    plugin: plugin
};