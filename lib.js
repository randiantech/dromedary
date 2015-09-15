var environment = process.env.RT_ENV || 'dev';
var CONFIG_FILE_PATH = './config.'+ environment +'.json';
var express = require('express');
var bodyParser = require('body-parser');
CONFIG_FILE = require(CONFIG_FILE_PATH);


function setup(){
    var app = express();
    app.use( bodyParser.json() );
    app.set('port', CONFIG_FILE['config']['port']);
    app.listen(app.get('port'), function () { console.log("started"); });

    Object.keys(CONFIG_FILE['routes']).forEach(function(route){
        Object.keys(CONFIG_FILE['routes'][route]['middleware']).forEach(function(componentName){
            var plugin = require("./plugins/" + componentName).plugin || require(componentName).plugin;
            app.use(route, plugin);
        });
    });
}

setup();

module.exports = {
    setup : setup
};