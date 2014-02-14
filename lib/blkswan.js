#!/usr/bin/env node

var argv = require('minimist')(process.argv.slice(2));
var fs = require('fs');

var usage = [
    ''
  , '  Usage: blkswan migrate:[command] [options]'
  , ''
  , '  Options:'
  , ''
  , '  Commands:'
  , ''
  , '     make [title]	creates a new migration file with option [title]'
  , '     install [dir]		creates migration table in database'
  , '     up []		migrate all unmigrated files (the default command)'
  , '     down []		rolls back the most recent migration'
  , '     reset []		rolls back all migrations'
  , '     setup [dir]		creates migration directory and db config'
  , ''
].join('\n');

// Parse arguments

if (argv.help || argv.h) {
	console.log(usage);
	process.exit(1);
}

switch (argv._[0]) {
	case 'migrate:make':
		console.log('make');
		break;
	case 'migrate:install':
		console.log('install');
		break;
	case 'migrate':
	case 'migrate:up':
		console.log('up');
		break;
	case 'migrate:down':
		console.log('down');
		break;
	case 'migrate:reset':
		console.log('reset')
		break;
	case 'migrate:setup':
		setup(argv._[1]);
		break;
	default:
		console.log(usage);
		process.exit(0);
}

// 1. create a migrations direcory
// 2. add a file for db conf
// 3. add file to .gitignore 
function setup (folder) {
	var folder = folder || 'migrations';
	fs.exists('./' + folder, function(exists) {
		if (exists) {
			// 
		} else {
			fs.mkdir('./' + folder, 0774, function(err) {
				if (err) throw err;
				mkMsg('create', folder);
			})
		}
		fs.exists('./' + folder + '/db.conf.js', function(exists) {
			if (exists) {
				// 
			} else {
				var input = dbConfSync(); 
				fs.writeFile('./' + folder + '/db.conf.js', input, function(err) {
					if (err) throw err;
					mkMsg('create', folder + '/db.conf.js');
				})
			}
			fs.exists('./.gitignore', function(exists) {
				if (exists) {
					var text = '\n' + folder + '/db.conf.js \n';
					fs.appendFile('./.gitignore', text, function(err) {
						if (err) throw err;
						appendMsg('append', '.gitignore');
						process.exit(1);
					})
				} else {
					fs.writeFile('./.gitignore', folder + '/db.conf.js \n', function(err) {
						if (err) throw err;
						mkMsg('create', '.gitignore');
						process.exit(1)
					})
				}
			})
		})
	});
}

function mkMsg (key, msg) {
	console.log('  \033[90m%s :\033[0m \033[36m%s\033[0m', key, msg);
}

function appendMsg (key, msg) {
	console.log('  \033[90m%s :\033[0m \033[36m%s\033[0m', key, msg)
}

function dbConfSync () {
	var out = ''

	+ 'var mysql = require(\'mysql\'); \n\n'

	+ 'exports.db = mysql.createConnection ({ \n'
	+ '		host     : \'localhost\', \n'
	+ '		user     : \'user\', \n'
	+ '		password : \'supersecret\', \n'
	+ '		database : \'database\' \n'
	+ '}); \n';

	return out;
	
}