var fs = require('fs');
var db = require(__dirname + '/conf.js').db;

function migrate(file, direction) {
	var direction = direction || 'up';
	mkMsg(file, 'migrated ' + direction);
}



exports.up = function(argv) {
	db.query('SELECT * FROM migrations WHERE migrated = 0 ORDER BY created_at', function(err, rows) {
		if (err) throw err;
		rows.forEach(function(migration) {
			migrate(migration.file);
		})
		process.exit(1);
	})
}

exports.down = function(argv) {
	db.query('SELECT * FROM migrations WHERE migrated = 0 ORDER BY created_at DESC LIMIT 1', function(err, rows) {
		if (err) throw err;
		rows.forEach(function(migration) {
			migrate(migration.file, 'down');
		})
		process.exit(1);
	})
}

exports.reset = function(argv) {
	db.query('SELECT * FROM migrations WHERE migrated = 0 ORDER BY created_at DESC', function(err, rows) {
		if (err) throw err;
		rows.forEach(function(migration) {
			migrate(migration.file, 'down');
		})
		process.exit(1);
	})
}

exports.one = function(argv) {
	db.query('SELECT * FROM migrations WHERE migrated = 0 ORDER BY created_at LIMIT 1', function(err, rows) {
		if (err) throw err;
		rows.forEach(function(migration) {
			migrate(migration.file);
		})
		process.exit(1);
	})
}

function mkMsg (key, msg) {
	console.log('  \033[90m%s :\033[0m \033[36m%s\033[0m', key, msg);
}