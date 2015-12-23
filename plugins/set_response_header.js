var cfg = require("../lib/plugin").cfg;

/**
 * set_response_header plugin for Dromedary library
 * Sets the given header in the HTTP response
 * @param req the HTTP request
 * @param res the HTTP response
 * @param cb the callback function
 */
function plugin(req, res, cb) {
    var _ = cfg(req);
    Object.keys(_['header']).forEach(function (headerName) {
        res.header(headerName, _['header'][headerName]);
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
