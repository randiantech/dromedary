#! /usr/bin/env node

var koa = require('koa');
var routeKoa = require('koa-route');
var winston = require('winston');
var execSync = require('child_process').execSync;
var app = koa();
var remotePlugins = [];

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
 * @private
 */
function *f() {
    this.status = 200;
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
 * starting from root dromedary file, recursively goes through all dro files aggregating all route flows and conditions
 * in a single, in memory dromedary file.
 * @param df dromedary file
 * @private
 */
function _recursivePluginLoading(df) {
    df.routes.forEach(function (route) {
        route['flow'].forEach(function (plugin) {
            if (plugin.name === "composite") {
                var rdf = require(plugin['path']);
                _getRemotePlugins(rdf);
                _recursivePluginLoading(rdf);
            } else {
                winston.log('info', 'loaded flow step ' + plugin.description || plugin.name + '" of route ' + route);
                if (remotePlugins.indexOf(plugin.name) == -1) {
                    plugin = require(DF['env']['localPlugins'] + "/" + plugin.name)
                } else {
                    plugin = require(plugin.name);
                }
                if (_isDFRequiredToBeAggregated(df)) {
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
                app.use(routeKoa.get(route.path, plugin.plugin));
            }
        });
    });
}

/**
 * Checks if the current dromedary file require to be aggregated to the in memory dromedary file that is ultimately
 * used through all application
 * @param df Dromedary File being evaluated
 * @returns {boolean} TRUE if needs to be aggregated, otherwise false
 * @private
 *
 * !Criteria
 *
 * -> If Dromedary File is the root file (the dromedary file loaded when started the app) it wont be required to be
 * aggregated, since initial image of the aggregated dromedary file copies the root dromadery file entirely.
 *
 * -> If dro file is already aggregated, avoid adding it again
 */
function _isDFRequiredToBeAggregated(df){
    return !df.isRoot && !df.isAggregated;
}


/**
 * Entry point of Dromedary apps
 */
function start() {
    execSync('npm install ' + remotePlugins);
    app.listen(DF.env.port);

    DF.isRoot = true;
    _getRemotePlugins(DF);
    _recursivePluginLoading(DF);
    //app.use(routeKoa.get('/*', f));
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
