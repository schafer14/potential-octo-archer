var fs = require('fs');
var db;;

exports.create = function(argv) {
	db = require(__dirname + '/conf.js').db;
	var up = {};
	var down = {};
	var name = argv._[1];
	var filename = Date.now() + '_' + name + '.js';
	
	(function(cb) {

		var arr = argv._[1].split('_');
		if (arr[0] === 'create' && arr[arr.length - 1] === 'table') {
			argv._.shift();
			argv._.shift();
			arr.pop();
			arr.shift();
			var table = arr.join('_');
			up[table] = {};
			down.drop = table;
			up[table].id = {type: 'increments'};
			if (typeof argv.int === 'string') {
				up[table][argv.int] = {type: 'int'}
			} else {
				for(var index in argv.int) {
					up[table][argv.int[index]] = {type: 'int'};
				}
			}
			for(var index in argv._) {
				up[table][argv._[index]] = {type: 'string'};
			}
			up[table].created_at = {type: "timestamp", "time":"NOW"};
		}

		var text = 'exports.up = ' + JSON.stringify(up) + '\n\n'
			+ 'exports.down = ' + JSON.stringify(down);

		cb(text);

	})(function (text) {
		fs.writeFile('./migrations/' + filename, text, function (err) {
  			if (err) throw err;
  			db.query('INSERT INTO migrations (file) values (?)', filename, function(err) {
  				mkMsg('migrations/' + filename, 'created');
				process.exit(1);
  			})
		});
	});

}

function mkMsg (key, msg) {
	console.log('  \033[90m%s :\033[0m \033[36m%s\033[0m', key, msg);
}