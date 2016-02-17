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
 * @returns array|null
 */
MediaLibrary.prototype.getVideos = function(validExtensions, limit) {
    var path = this.path;
    var contents = fs.readdirSync(path);
    contents.sort(function (a, b) {
        return fs.statSync(path + b).mtime.getTime() - fs.statSync(path + a).mtime.getTime();
    });

    var videos = [];
    for (var i = 0; i < contents.length && (limit && videos.length < limit); i++) {
        var content = path + contents[i];
        var video;
        if (fs.lstatSync(content).isDirectory()) {
            video = extractVideoFromDirectory(content, validExtensions);
        } else {
            video = extractVideo(content, validExtensions);
        }
        if (video) {
            videos.push(video);
        }
    }

    return videos;
};

/**
 * Retrieves the latest video file found in the library.
 *
 * @param validExtensions
 * @returns string|null
 */
MediaLibrary.prototype.getFirstVideo = function(validExtensions) {
    var video = this.getVideos(validExtensions, 1);
    if (! video || video.length === 0) {
        return null;
    }
    return video[0];
};

function extractVideoFromDirectory(directory, validExtensions) {
    var contents = fs.readdirSync(directory);
    for (var i = 0; i < contents.length; i++) {
        var video = extractVideo(contents[i], validExtensions);
        if (video) {
            return directory + '/' + video;
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
