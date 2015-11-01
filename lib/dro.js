#! /usr/bin/env node

var express = require('express');
var bodyParser = require('body-parser');
var winston = require('winston');
var localPluginsPath = "../plugins/";
var execSync = require('child_process').execSync;

/* global object that contains the  */
DF = require(_getDromedaryFile());


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

function _getRemotePlugins() {
    var remotePlugins = [];
    Object.keys(DF.routes).forEach(function (route) {
        Object.keys(DF.routes[route].flow).forEach(function (flownStepName) {
            var plugin = DF.routes[route].flow[flownStepName];
            var pluginName = plugin.pluginName;
            var isLocal = plugin.isLocalPlugin;
            if (!isLocal) remotePlugins.push(pluginName);
        });
    });
    return remotePlugins.filter(function (item, pos) {
        return remotePlugins.indexOf(item) == pos;
    }).join(" ");
}

function start() {
    var remotePlugins = _getRemotePlugins();
    execSync('npm install ' + remotePlugins);
    var app = express();
    app.use(bodyParser.json());
    app.set('port', DF.env.port);
    app.listen(app.get('port'), function () {
        winston.log('info', 'dromedary running in port ' + DF.env.port);
    });

    Object.keys(DF.routes).forEach(function (route) {
        Object.keys(DF.routes[route].flow).forEach(function (flownStepName) {
            winston.log('info', 'loaded flow step "' + flownStepName + '" of route ' + route);
            var pluginName = DF.routes[route]['flow'][flownStepName].pluginName;
            var plugin;
            if (remotePlugins.indexOf(pluginName) == -1) {
                plugin = require(localPluginsPath + pluginName);
            } else {
                plugin = require(pluginName)
            }
            app.use(route, plugin.plugin);
            winston.log('info', 'plugin ' + plugin + ' correctly installed from local plugins folder');
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
