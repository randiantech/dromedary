var request = require("request");

/**
 * http plugin for Dromedary framework
 * @param req the HTTP request
 * @param res the HTTP response
 * @param cb the callback function
 */
function plugin(req, res, cb) {
    var http = CONFIG_FILE['routes'][req.baseUrl]['middleware']['http'];
    var url = http['url'];
    var method = http['method'];

    request({
        uri: http['url'],
        method: http['method'].toUpperCase(),
        timeout: http['timeout'],
        followRedirect: false,
        maxRedirects: 0
    }, function(error, response, body) {
        if(error) cb(error);
        cb();
    });
}

/**
 * Public Inteface
 * @type {{plugin:plugin}}
 */
module.exports = {
    plugin: plugin
};