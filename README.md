potential-octo-archer
===========================

## NPM package for easy migrations using mysql. 

#### Features
  - Provide easy command line migration file generation
  - MySql syntax mapper for migration files
  - Auto migrations for migrating: up, all, down, and reset
  - Migration tracker for keeping track of migration


#### Examples

```
$ blkswan migrate:setup
```

Now go into migrations/db.conf.js and enter config variables

Create a mysql database

```
$ blkswan migrate:install
```

This will add a migrations table to your database

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

## Still to come
  - migrations (up, down, reset, all(default))
  - syntax for the creating. 
