/**
 * set_headers plugin for Dromedary framework
 * @param req the HTTP request
 * @param res the HTTP response
 * @param cb the callback function
 */
function plugin(req, res, cb) {
    Object.keys(CONFIG_FILE['routes'][req.baseUrl]['middleware']['set_headers']['headers']).forEach(function (headerName) {
        req.headers[headerName] = CONFIG_FILE['routes'][req.baseUrl]['middleware']['set_headers']['headers'][headerName];
    });
    cb();
}

/**
 * Public Inteface
 * @type {{plugin:plugin}}
 */
module.exports = {
    plugin: plugin
};