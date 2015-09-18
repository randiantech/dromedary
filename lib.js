var environment = 'dev';
var CONFIG_FILE_PATH = './config.'+ environment +'.json';
var express = require('express');
var bodyParser = require('body-parser');
var process = require('./lib/middleware').process;

CONFIG_FILE = require(CONFIG_FILE_PATH);


function start(){
    var app = express();
    app.use( bodyParser.json() );
    app.set('port', CONFIG_FILE['env']['port']);
    app.listen(app.get('port'), function () { console.log("started"); });

    Object.keys(CONFIG_FILE['routes']).forEach(function(route){
        Object.keys(CONFIG_FILE['routes'][route]['middleware']).forEach(function(componentName){
            var plugin = require("./plugins/" + componentName).plugin || require(componentName).plugin;
            app.use(route, plugin);
            switch(CONFIG_FILE['routes'][route]['method']){
                case 'GET':
                case 'get':
                    app.get(route, process);
            }
        });
    });
}

start();

module.exports = {
    start : start
};