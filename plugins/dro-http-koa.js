//use strict;

var request = require("request");
var cfg = require("../lib/plugin").cfg;
var saveData = require("../lib/plugin").saveData;

function *plugin(next) {
    yield next;
    console.log("->dro-koa-http");
    var _ = cfg(this.request);
    request({
        uri: _.uri || _.url,
        method: _.method.toUpperCase(),
        timeout: _.timeout,
        followRedirect: false,
        maxRedirects: 0
    }, function(error, response, body) {
        if(error) {
            this.body = error;
        } else {
            saveData(this.req, response, _.data);
            this.body = body;
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
