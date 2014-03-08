var fs = require('fs');
var db;

exports.up = function(argv, cb) {
	prepSync();
	db.query('SELECT * FROM migrations WHERE migrated = 0 ORDER BY created_at', function(err, rows) {
		if (err) throw err;
		rows.forEach(function(migration) {
			migrate(migration.file);
		})
		cb();
	})
}

exports.down = function(argv, cb) {
	prepSync();
	db.query('SELECT * FROM migrations WHERE migrated = 1 ORDER BY created_at DESC LIMIT 1', function(err, rows) {
		if (err) throw err;
		rows.forEach(function(migration) {
			migrate(migration.file, 'down');
		})
		cb();
	})
}

exports.reset = function(argv, cb) {
	prepSync();
	db.query('SELECT * FROM migrations WHERE migrated = 1 ORDER BY created_at DESC', function(err, rows) {
		if (err) throw err;
		rows.forEach(function(migration) {
			migrate(migration.file, 'down');
		})
		cb();
	})
}

exports.one = function(argv, cb) {
	prepSync();
	db.query('SELECT * FROM migrations WHERE migrated = 0 ORDER BY created_at LIMIT 1', function(err, rows) {
		if (err) throw err;
		rows.forEach(function(migration) {
			migrate(migration.file);
		})
		cb();
	})
}

// 0. See if file exists (no: throw warning) [check]
// 1. Get object (up or down) [check]
// 2. Translate to mySQL [check]
// 3. Run Query [wtf m8]
// 4. Update migrations table
function migrate(file, direction) {
	var direction = direction || 'up';
	if (!fs.existsSync('migrations/' + file)) {
		mkErr('Warning', 'Migration ' + file + ' file not found.');
	} else {
		var mig = require('../migrations/' + file)[direction];
		translate(mig, function(err, query) {
			if(err) {
				mkErr('Error', err.msg);
			} else {
				db.query(query, function(err) {
					if (err) throw err;
					mkMsg('migrations/' + file, 'Migrated');
					var q = 'UPDATE migrations SET migrated = ? WHERE file = ?';
					var temp = direction === 'up' ? '1' : '0';
					db.query(q, [temp, file], function(err) {
						if (err) throw err;
					});
				});
			}
		});
	}
}

function translate(obj, cb) {
	for (cmd in obj) {
		switch(cmd) {
			case 'drop':
				drop(obj[cmd], cb);
				break;
			case 'alter':
				alter(obj[cmd], cb);
				break;
			case 'seed':
				seed(obj[cmd], cb);
				break;
			default:
				create(cmd, obj[cmd], cb);
				break;
		}
	}
}

function drop(obj, cb) {
	var text = ''
		+ 'DROP TABLE IF EXISTS ' + obj;

	cb(null, text);
}

function alter(obj, cb) {
	cb({msg: 'Alter table coming in v2.0.0'});
}

function seed(obj, cb) {
	cb({msg: 'Seeding coming in v2.0.0'});
}

function create (table, obj, cb) {
	var text = ''
		+ 'CREATE TABLE IF NOT EXISTS ' + table + ' ( \n';
	var pk = '';

	for (i in obj) {
		var name = i;
		switch (obj[i].type.toLowerCase()) {
			case 'increments':
				text += name + ' INT(10) NOT NULL AUTO_INCREMENT, \n';
				pk += 'PRIMARY KEY(' + name + ')';
				break;
			case 'string':
				var len = obj[i].length || '256';
				text += name + ' VARCHAR(' + len + ') ';
				text += add(obj[i]);
				break;
			case 'int':
			case 'integer':
				var len = obj[i].length || '10';
				text += name + ' INT(' + len + ') ';
				text += add(obj[i]);
				break;
			case 'small':
				text += name + ' INT(1) ';
				text += add(obj[i]);
				break;
			case 'longtext':
				text += name + ' LONGTEXT ';
				text += add(obj[i]);
				break;
			case 'longint':
			case 'long':
				text += name + ' INT(100) ';
				text += add(obj[i]);
				break;
			case 'datetime':
				text += name + ' DATETIME ';
				text += add(obj[i]);
				break;
			case 'timestamp':
				text += name + ' timestamp ';
				text += add(obj[i]);
				break;
			case 'time':
				text += name + ' TIME ';
				text += add(obj[i]);
				break;
			case 'date':
				text += name + ' DATE ';
				text += add(obj[i]);
				break;
			case 'double':
				var len = obj[i].length || '7';	
				var dec = obj[i].decimal || '4';
				text += name + ' DOUBLE(' + len + ', ' + dec + ') ';
				text += add(obj[i]);
				break;
			case 'index':
				var col = obj[i].column || '';
				text += 'INDEX ' + name + ' (' + col + ') , \n';
				break;
		}
	}

	// Must use substring here to take off trailing newline and comma
	cb(null, text + pk + '\n);');

	function add(obj) {
		var text = '';
		for (i in obj) {
			switch (i.toLowerCase()) {
				case 'null':
					var b = !obj[i] || obj[i] === 'false' || obj[i] === 'FALSE' || obj[i] === 'False';
					var t = b ? 'NOT NULL ' : '';
					text += t;
					break;
				case 'default':
					text += 'DEFAULT \'' + obj[i] + '\' ';
					break;
				case 'unique':
					if (obj[i]) {
						text += 'UNIQUE ';
					}
					break;
				case 'unsigned':
					if(obj[i]) {
						text += ' UNSIGNED ';
					}
					break;
				case 'time':
					text += 'DEFAULT CURRENT_TIMESTAMP'
					break;
			}
		}
		
		return text += ',\n';
	}
}

function prepSync() {
	db = require(__dirname + '/conf.js').db;
	if (!fs.existsSync('./migrations')) {
		mkErr('Error', 'Migrations directory not found');
		process.exit(0);
	}
}

function mkMsg (key, msg) {
	console.log('  \033[90m%s :\033[0m \033[35m%s\033[0m', key, msg);	
}

function mkErr (key, msg) {
	console.log('  \033[31m%s :\033[0m \033[36m%s\033[0m', key, msg);
}