var fs = require('fs');
var db;

exports.install = function(folder) {
	var folder = folder || 'migrations';
	fs.writeFile(__dirname + '/conf.js', '', function(err) {
		if (err) throw err;
		var reader =fs.createReadStream(folder + '/db.conf.js');
		reader.pipe(fs.createWriteStream(__dirname + '/conf.js'));
		reader.on('end', function() {
			db = require(__dirname + '/conf.js').db;
			db.query(tableMkrSync(), function(err) {
				if (err) throw err;
				mkMsg('created', 'migrations table');
				process.exit(1);
			});
		})

	});
}


function tableMkrSync() {
	var query = ''
 		+ "CREATE TABLE IF NOT EXISTS migrations ( " 
        + "file VARCHAR(512) NOT NULL, " 
        + "migrated INT(1) NOT NULL DEFAULT 0, " 
        + "created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)";
	
	return query;
}


function mkMsg (key, msg) {
	console.log('  \033[90m%s :\033[0m \033[36m%s\033[0m', key, msg);
}