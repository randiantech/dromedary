var request = require("request");
var cfg = require("../lib/plugin").cfg;
var saveData = require("../lib/plugin").saveData;

/**
 * http plugin for Dromedary framework
 * @param req the HTTP request
 * @param res the HTTP response
 * @param cb the callback function
 */
function plugin(req, res, cb) {
    console.log("->dro-http");
    var _ = cfg(req);
    request({
        uri: _.uri || _.url,
        method: _.method.toUpperCase(),
        timeout: _.timeout,
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
