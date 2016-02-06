var express = require('express');
var router = express.Router();
var config = require('../config.js');
var mediaLibrary = require('../models/MediaLibrary');

router.get('/', function(req, res, next) {

  var library = new mediaLibrary.MediaLibrary(config.share.internal_path);
  var videos = library.getVideos(config.valid_file_extensions);

  res.render('index', { title: 'Express' });

});

module.exports = router;
