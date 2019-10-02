const Transform = require('stream').Transform;
const PluginError = require('plugin-error');


const PLUGIN_NAME = 'gulp-reshape';

module.exports = function gulpReshape(reshapeCompiler) {
	function transform(file, enc, callback) {
		if (file.isNull()) {
			return callback(null, file);
		} else if (file.isBuffer()) {
			reshapeCompiler.process(file.contents, { filename: file.path })
				.then(result => {
					file.contents = Buffer.from(result.output());
					callback(null, file);
				})
				.catch(err => {
					this.emit('error', new PluginError(PLUGIN_NAME, err, { fileName: file.path }));
					//TODO fix potentially unhandled rejection error
				});
		} else if (file.isStream()) {
			this.emit('error', new PluginError(PLUGIN_NAME, 'Streams not supported!'));
		}
	}
	
	return new Transform({ objectMode: true, transform });
}
