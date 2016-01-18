//use strict;

var request = require('koa-request');
var cfg = require("../lib/plugin").cfg;

function *plugin(){
    console.log("->dro-koa-http");
    var _ = cfg(this.request);
    var response = yield request({url: _.uri});
    this.body = JSON.parse(response.body);
}

/**
 * Public Inteface
 * @type {{plugin:plugin}}
 */
module.exports = {
    plugin: plugin
};
