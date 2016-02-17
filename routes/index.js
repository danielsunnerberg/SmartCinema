var express = require('express');
var router = express.Router();
var config = require('../config');
var mediaLibrary = require('../models/MediaLibrary');
var kodiApiExecutor = require('../models/KodiApiExecutor');

router.get('/', function (req, res, next) {

    var library = new mediaLibrary.MediaLibrary(config.share.internal_path);
    var video = library.getFirstVideo(config.valid_file_extensions);
    video = video.replace(config.share.internal_path, config.share.external_path);

    var executor = new kodiApiExecutor.KodiApiExecutor(config.kodi_ip);
    executor.playFile(video, function(response) {
        res.render('index', {body: response});
    });

});

module.exports = router;
