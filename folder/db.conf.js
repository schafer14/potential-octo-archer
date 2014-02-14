var mysql = require('mysql'); 

exports.db = mysql.createConnection ({ 
		host     : 'localhost', 
		user     : 'user', 
		password : 'supersecret', 
		database : 'database' 
}); 
