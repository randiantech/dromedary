var express = require('express');
var bodyParser = require('body-parser');
var localPluginsPath = "./plugins/";

DF = null;

/**
 * gets the plugin associated to the given component name
 * @param pluginName the name of the required plugin
 * @returns {plugin} the plugin associated to the given component name
 * @private
 */
function _getPlugin(pluginName){
    return require(localPluginsPath + pluginName).plugin || require(pluginName).plugin;
}

function _finally(req, res){
    res.status(200).send(res.body);
}

function start(dromedaryFilePath){
    var app = express();
    DF = require(dromedaryFilePath);
    app.use( bodyParser.json() );
    app.set('port', DF.env.port);
    app.listen(app.get('port'), function () {
        console.log("->dromedary running in port " + DF.env.port);
    });

    Object.keys(DF.routes).forEach(function(route){
        Object.keys(DF.routes[route].flow).forEach(function(flownStepName){
            app.use(route, _getPlugin(DF.routes[route]['flow'][flownStepName].pluginName));
        });
        app.get('/*', _finally);
    });

}

start('./dromedaryFile.json');

module.exports = {
    start : start
};