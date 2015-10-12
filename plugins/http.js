var request = require("request");
var cfg = require("../plugin").cfg;
var saveData = require("../plugin").saveData;

/**
 * http plugin for Dromedary framework
 * @param req the HTTP request
 * @param res the HTTP response
 * @param cb the callback function
 */
function plugin(req, res, cb) {
    console.log("->http plugin");
    var _ = cfg(req);
    var id = _.id;
    var url = _.url;
    var method = _.method;

    request({
        uri: _['uri'] || _['url'],
        method: _['method'].toUpperCase(),
        timeout: _['timeout'],
        followRedirect: false,
        maxRedirects: 0
    }, function(error, response, body) {
        if(error) {
            cb(error);
        } else {
            saveData(req, response, _.data);
            cb();
        }
    });
}

/**
 * Public Inteface
 * @type {{plugin:plugin}}
 */
module.exports = {
    plugin: plugin
};