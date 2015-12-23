var cfg = require("../lib/plugin.js").cfg;
var getData = require("../lib/plugin").getData;

/**
 * set_response_body plugin for Dromedary library.
 * Sets the given header in the HTTP request
 * @param req the HTTP request
 * @param res the HTTP response
 * @param cb the callback function
 */
function plugin(req, res, cb) {
    var _ = cfg(req);
    res.body = JSON.parse(getData(req, _.data).body);
    cb();
}

/**
 * Public Inteface
 * @type {{plugin:plugin}}
 */
module.exports = {
    plugin: plugin
};
