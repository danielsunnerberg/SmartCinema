var util = require('util');
var http = require('http');

/**
 * @param kodiIp IP to Kodi computer
 * @constructor
 */
function KodiApiExecutor(kodiIp) {
    this.host = kodiIp;
}

/**
 * Asks Kodi to play the file on the specified path.
 * @param file
 */
KodiApiExecutor.prototype.playFile = function(file) {
    var request = util.format(
        '{"jsonrpc":"2.0","id":"1","method":"Player.Open","params":{"item":{"file":"%s"}}}',
        file
    );

    this.execute(request);
};

/**
 * Executes the provided request.
 *
 * @param request Request to be executed.
 * @param callback
 */
KodiApiExecutor.prototype.execute = function(request, callback) {
    var options = {
        host: this.host,
        path: util.format('/jsonrpc?request=%s', request)
    };

    var request = http.get(options, function(res) {
        console.log('STATUS: ' + res.statusCode);
        console.log('HEADERS: ' + JSON.stringify(res.headers));

        var bodyChunks = [];
        res.on('data', function (chunk) {
            bodyChunks.push(chunk);
        }).on('end', function () {
            var body = Buffer.concat(bodyChunks);
            if (callback) {
                callback(body);
            }
        });
    });

    request.on('error', function(e) {
        callback(e.message);
    });
};

exports.KodiApiExecutor = KodiApiExecutor;
