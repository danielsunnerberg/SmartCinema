var config = {};

config.share = {

    /**
     * Internal path to all shared media, WITH trailing (double) slash.
     */
    internal_path: 'D:\\Downloads\\',

    /**
     * External path to all shared media, WITH trailing (double) slash.
     */
    external_path: 'smb://DESKTOP-JKNV2SH\\Downloads\\'

};

/**
 * When scanning a directory for a media resource, the resource will only be accepted if it has one of the
 * following extensions.
 */
config.valid_file_extensions = [
    'avi',
    'mkv',
    'mp4',
    'mov'
];

module.exports = config;