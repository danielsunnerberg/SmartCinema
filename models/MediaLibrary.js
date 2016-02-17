var fs = require('fs');
var S = require('string');

/**
 * @param path Path to the media library, with trailing slash
 * @constructor
 */
function MediaLibrary(path) {
    this.path = path;
}

/**
 * Lists all videos in the library. If a directory is found, an attempt will be made to include the first valid video
 * found inside.
 *
 * @param validExtensions Array with valid file extensions
 * @param limit Max number of results to be returned
 * @returns {Array}
 */
MediaLibrary.prototype.getVideos = function(validExtensions, limit) {
    limit = limit || 100;
    var path = this.path;
    var contents = fs.readdirSync(path);
    contents.sort(function (a, b) {
        return fs.statSync(path + b).mtime.getTime() - fs.statSync(path + a).mtime.getTime();
    });
    contents.slice(0, limit);

    var videos = [];

    contents.forEach(function (content) {
        content = path + content;
        var video;
        if (fs.lstatSync(content).isDirectory()) {
            video = extractVideoFromDirectory(content, validExtensions);
        } else {
            video = extractVideo(content, validExtensions);
        }
        if (video) {
            videos.push(video);
        }
    });

    return videos;
};

function extractVideoFromDirectory(directory, validExtensions) {
    var contents = fs.readdirSync(directory);
    for (var i = 0; i < contents.length; i++) {
        var video = extractVideo(contents[i], validExtensions);
        if (video) {
            return directory + '\\' + video;
        }
    }
}

function extractVideo(content, validExtensions) {
    if (content.toLowerCase().indexOf('sample') > -1) {
        return null;
    }
    for (i = 0; i < validExtensions.length; i++) {
        if (S(content).endsWith(validExtensions[i])) {
            return content;
        }
    }
    return null;
}

exports.MediaLibrary = MediaLibrary;
