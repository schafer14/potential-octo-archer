## NPM package for easy migrations using mysql. 

#### Features
  - Provide easy command line migration file generation
  - MySql syntax mapper for migration files
  - Auto migrations for migrating: up, all, down, and reset
  - Migration tracker for keeping track of migration

#### Install
Make sure blkswan is installed globally
```
$ sudo npm install -g blkswan
```

Run all commands from the root directory of your project

Ensure mysql package is installed for acessing the database
```
$ npm install mysql
```


#### Setup
This step is optional. It will setup a migrations folder and add config files to your .gitignore.

```
$ blkswan migrate:setup
```

Now go into migrations/db.conf.js and enter config variables.

#### Install

```
$ blkswan migrate:install
```

This will add a migrations table to your database

#### Create migrations
```
$ blkswan migrate:create migration_name
```

This will create a file in your migrations directory with boilerplate code

-- Or --

```
$ blkswan migrate:create create_users_books_table
```

This will create code for creating a users_books table

You can also give params

```
$ blkswan migrate:create create_book_table name author --int=num_pages publisher --int=year_published
```

#### Running migrations
Running all migrations is default behaviour
```
$ blkswan migrate
```

Other options include
```
$ blkswan migrate:one
$ blkswan migrate:reset
$ blkswan migrate:down
```

One: migrates the next single migration

Reset: rolls back all migrations

Down: rolls back the last migration


## Migration Files
Map json objects to mysql queries

#### Creating a table
General syntax
```
exports.up = {
	"table_name":{
		"id":{"type":"increments"},
		"email":{"type":"string", "null":false, "length":"10"},
		"level":{"type":"double", "default":"1.618"}, 
		"exact_level":{"type":"double", "length":"9", "decimal":"4"},
		"my_index":{"type":"index", "column":"level"},
		"created_at":{"type":"timestamp","time":"NOW"}
	}
}
```
###### Available types
  - String or String defaults to length of 256
  - Increments: creates a auto incrmenting table with a primary id
  - Int or Integer defaults to length of 10
  - Small one digit int
  - Longtext
  - Datetime
  - Timestamp
  - Date
  - Double with length and decimal params defaults to double(7,4)
  - Index

###### Other params
  - "Unsigned":true
  - "Null":false
  - "Default":"blkswan"
  - "Unique":true
  - "Unsighed":true
  
#### Drop table syntax
```
exports.down = {"drop":"table_name"}
```

