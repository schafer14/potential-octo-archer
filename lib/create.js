var fs = require('fs');
var db = require(__dirname + '/conf.js').db;

exports.create = function(argv) {
	var up = {};
	var down = {};
	var arr = argv._[1].split('_');
	if (arr[0] === 'create' && arr[arr.length - 1] === 'table') {
		argv._.shift();
		argv._.shift();
		arr.pop();
		arr.shift();
		var table = arr.join('_');
		up[table] = {}
		down.drop = table
		up[table].id = {type: 'increments'}
		for(var index in argv._) {
			up[table][argv._[index]] = {type: 'string'}
		}
		for(var index in argv.int) {
			up[table][argv.int[index]] = {type: 'int'}
		}
		console.log(up);
	}
	process.exit(1);
}