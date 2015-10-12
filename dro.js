var express = require('express');
var bodyParser = require('body-parser');
var winston = require('winston');
var _ = require('lodash');
var localPluginsPath = "./plugins/";

/* global object that contains the  */
DF = require(_getDromedaryFile());


/**
 * Gets the Dromedary Application File Definition using the file path provided as first arg to dro command
 * @returns {*} Dromedary file path with relative path prefix if missed (in example: if arg is myDroFile.json,
 * this function will return ./myDroFile.json
 * @private
 */
function _getDromedaryFile() {
    var df = process.argv[2];
    var isRelPath = _.startsWith(df, "./");
    var isAbsPath = _.startsWith(df, "/");
    /* in case relative or absolute path prefix is missed, lets default to relative */
    if (!isRelPath && !isAbsPath) df = "./" + df;
    return df;
}

/**
 * gets the plugin associated to the given component name
 * @param pluginName the name of the required plugin
 * @returns {plugin} the plugin associated to the given component name
 * @private
 */
function _getPlugin(pluginName) {
    return require(localPluginsPath + pluginName).plugin || require(pluginName).plugin;
}

/**
 * Final step that is executed after all defined flow steps were completed
 * @param req the HTTP request
 * @param res the HTTP response
 * @private
 */
function _finally(req, res) {
    res.status(200).send(res.body);
}

function start() {
    var app = express();
    app.use(bodyParser.json());
    app.set('port', DF.env.port);
    app.listen(app.get('port'), function () {
        winston.log('info', 'dromedary running in port ' + DF.env.port);
    });

    Object.keys(DF.routes).forEach(function (route) {
        Object.keys(DF.routes[route].flow).forEach(function (flownStepName) {
            winston.log('info', 'loaded flow step "' + flownStepName + '" of route ' + route);
            app.use(route, _getPlugin(DF.routes[route]['flow'][flownStepName].pluginName));
        });
        app.get('/*', _finally);
    });

}

/* starts dromedary application */
start();

/**
 * Public Interface
 * @type {{start: start}}
 */
module.exports = {
    start: start
};