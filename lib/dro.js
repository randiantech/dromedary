#! /usr/bin/env node

var express = require('express');
var bodyParser = require('body-parser');
var winston = require('winston');
var localPluginsPath = "../plugins/";
var execSync = require('child_process').execSync;
var app = express();
ROOT_DROMEDARY_FILE = require(_getDromedaryFile()); /* global object that contains the  */
var remotePlugins = _getRemotePlugins();


/**
 * Gets the Dromedary Application File Definition
 * @returns {*} Dromedary file path with relative path prefix if missed (in example: if arg is myDroFile.json,
 * this function will return ./myDroFile.json
 * @private
 */
function _getDromedaryFile() {
    return process.argv[2];
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


/**
 * Creates an string of all the remote plugins that needs to be obtained from NPM public index
 * @returns {string} string blank space separated string with names of all remote plugins
 * @private
 */
function _getRemotePlugins() {
    var remotePlugins = [];
    Object.keys(ROOT_DROMEDARY_FILE.routes).forEach(function (route) {
        Object.keys(ROOT_DROMEDARY_FILE.routes[route].flow).forEach(function (flownStepName) {
            var plugin = ROOT_DROMEDARY_FILE.routes[route].flow[flownStepName];
            var pluginName = plugin.pluginName;
            var isLocal = plugin.isLocalPlugin;
            if (!isLocal) remotePlugins.push(pluginName);
        });
    });
    return remotePlugins.filter(function (item, pos) {
        return remotePlugins.indexOf(item) == pos;
    }).join(" ");
}

/**
 * starting from root dromedary file, recursively goes through all dro files injecting in order defined middleware
 * @param df dromedary file
 * @private
 */
function _recursivePluginLoading(df) {
    Object.keys(df.routes).forEach(function (route) {
        Object.keys(df.routes[route]['flow']).forEach(function (stepName) {
            var pluginName = df.routes[route]['flow'][stepName].pluginName;
            if (pluginName === "composite") {
                var rdf = require(df.routes[route]['flow'][stepName]['path']);
                _recursivePluginLoading(rdf);
            } else {
                winston.log('info', 'loaded flow step "' + stepName + '" of route ' + route);
                var plugin;
                remotePlugins.indexOf(pluginName) == -1 ? plugin = require(localPluginsPath + pluginName) : plugin = require(pluginName);
                app.use(route, plugin.plugin);
                winston.log('info', 'plugin ' + plugin + ' correctly installed from local plugins folder');
            }
        });
    });
}

/**
 * Entry point of Dromedary apps
 */
function start() {
    execSync('npm install ' + remotePlugins);
    app.use(bodyParser.json()); //TODO This would be configurable through dro file as well
    app.set('port', ROOT_DROMEDARY_FILE.env.port);
    app.listen(app.get('port'), function () {
        winston.log('info', 'dromedary running in port ' + ROOT_DROMEDARY_FILE.env.port);
    });

    _recursivePluginLoading(ROOT_DROMEDARY_FILE);
    app.get('/*', _finally);
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
