#! /usr/bin/env node

var express = require('express');
var bodyParser = require('body-parser');
var winston = require('winston');
var execSync = require('child_process').execSync;
var app = express();
var remotePlugins = [];


/* Global, decorated Dromedary File */
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


/**
 * Creates an string of all the remote plugins that needs to be obtained from NPM public index
 * @param df dromedary file
 * @returns {string} string blank space separated string with names of all remote plugins
 * @private
 */
function _getRemotePlugins(df) {
    df.routes.forEach(function (route) {
        route['flow'].forEach(function (plugin) {
            var isLocal = plugin.isLocalPlugin;
            if (!isLocal) remotePlugins.push(plugin.name);
        });
    });
    return remotePlugins.filter(function (plugin, pos) {
        return remotePlugins.indexOf(plugin) == pos;
    }).join(" ");
}

/**
 * starting from root dromedary file, recursively goes through all dro files injecting in order defined middleware
 * @param df dromedary file
 * @param routePos the offset param
 * @private
 */
function _recursivePluginLoading(df, routePos) {
    df.routes.forEach(function (route) {
        route['flow'].forEach(function (plugin) {
            if (plugin.name === "composite") {
                var rdf = require(plugin['path']);
                _getRemotePlugins(rdf);
                _recursivePluginLoading(rdf, routePos++);
            } else {
                winston.log('info', 'loaded flow step ' + plugin.description || plugin.name + '" of route ' + route);
                if (remotePlugins.indexOf(plugin.name) == -1) {
                    plugin = require(DF['env']['localPlugins'] + "/" + plugin.name)
                } else {
                    plugin = require(plugin.name);
                }
                if (!df.isRoot && !df.isAggregated) {
                    DF.routes.forEach(function (rootRoute) {
                        if (rootRoute.path == route.path){
                            rootRoute['flow'] = rootRoute['flow'].concat(route['flow']);
                            Object.keys(df['conditions']).forEach(function(condition){
                               DF['conditions'][condition] = df['conditions'][condition];
                            });
                            df.isAggregated = true;
                        }
                    });
                }
                app.use(route.path, plugin.plugin);
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
    app.set('port', DF.env.port);
    app.listen(app.get('port'), function () {
        winston.log('info', 'dromedary running in port ' + DF.env.port);
    });

    DF.isRoot = true;
    _getRemotePlugins(DF);
    _recursivePluginLoading(DF, 0);
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
