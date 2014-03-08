#!/usr/bin/env node

var argv = require('minimist')(process.argv.slice(2));
var fs = require('fs');
var install = require(__dirname + '/install');
var create = require(__dirname + '/create');
var migrate = require(__dirname + '/migrate');

var usage = [
    ''
  , '  Usage: blkswan migrate:[command] [options]'
  , ''
  , '  Options:'
  , ''
  , '  Commands:'
  , ''
  , '     setup []		creates a new migration file with option'
  , '     install []		creates migration table in database'
  , '     create []		creates a migration'
  , '     up []		migrate all unmigrated files (the default command)'
  , '     down []		rolls back the most recent migration'
  , '     reset []		rolls back all migrations'
  , '     one []		migrates on forward'
  , ''
].join('\n');

// Parse arguments

if (argv.help || argv.h) {
	console.log(usage);
	process.exit(1);
}

switch (argv._[0]) {
	case 'migrate:make':
	case 'migrate:create':
		create.create(argv);
		break;
	case 'migrate:install':
		install.install(argv._[1]);
		break;
	case 'migrate':
	case 'migrate:up':
		migrate.prepare(argv, 'up');
		break;
	case 'migrate:down':
		migrate.prepare(argv, 'down');
		break;
	case 'migrate:reset':
		migrate.prepare(argv, 'reset');
		break;
	case 'migrate:setup':
		setup(argv._[1]);
		break;
	case 'migrate:one':
		migrate.prepare(argv, 'one');
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
	fs.exists(process.cwd() + '/' + folder, function(exists) {
		if (exists) {
			// 
		} else {
			fs.mkdir(process.cwd() + '/' + folder, 0774, function(err) {
				if (err) throw err;
				mkMsg('create', folder);
			})
		}
		fs.exists(process.cwd() + '/' + folder + '/db.conf.js', function(exists) {
			if (exists) {
				// 
			} else {
				fs.writeFile(process.cwd() + '/' + folder + '/db.conf.js', dbConfSync(), function(err) {
					if (err) throw err;
					mkMsg('create', folder + '/db.conf.js');
				})
			}
			fs.exists(process.cwd() + '/.gitignore', function(exists) {
				if (exists) {
					var text = '\n' + folder + '/db.conf.js \n';
					fs.appendFile(process.cwd() + '/.gitignore', text, function(err) {
						if (err) throw err;
						mkMsg('append', '.gitignore');
						process.exit(1);
					})
				} else {
					fs.writeFile(process.cwd() + '/.gitignore', folder + '/db.conf.js \n', function(err) {
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