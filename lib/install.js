var fs = require('fs');
var db;

exports.install = function(folder) {	
	db = require(process.cwd() + '/migrations/db.conf.js').db;
	db.query(tableMkrSync(), function(err) {
		if (err) throw err;
		mkMsg('created', 'migrations table');
		fs.readdir(process.cwd() + '/migrations', function(err, files) {
			var length = files.length;
			var count = 0;
			(function processFile () {
				var file = files.shift();
				if (file) {
					var date = new Date((file.split('_')[0]*1));
					if (date != 'Invalid Date') {
						var query = 'INSERT INTO migrations (file, created_at) values (?,?)';
						db.query(query, [file, date], function(err) {
							if (err) {
								mkErr('Warning', 'Duplicated entry: unique timestamps required');
							} else {
								mkMsg('added', file);
							}
							count = count + 1;
						})
					} else {
						count = count + 1;
					}
					processFile(files);
				} else {
					setInterval(function(){
						if (length == count) {
							process.exit(1)
						}
					},300)
				}
			}) ();
		});
	});
	
		
}


function tableMkrSync() {
	var query = ''
 		+ "CREATE TABLE IF NOT EXISTS migrations ( " 
        + "file VARCHAR(512) NOT NULL, " 
        + "migrated INT(1) NOT NULL DEFAULT 0, " 
        + "created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP UNIQUE)";
	
	return query;
}


function mkMsg (key, msg) {
	console.log('  \033[90m%s :\033[0m \033[36m%s\033[0m', key, msg);
}

function mkErr (key, msg) {
	console.log('  \033[31m%s :\033[0m \033[36m%s\033[0m', key, msg);
}