-   MySQL Community Server
-   MySQL Workbench

After installing MySQL Community Server you should have MySQL CLC (Command Line Client) available

To start/stop the server `mysql.server start` `mysql.server stop`

-   Once the server has spined up you're machine will be ready to establish connections between clients and the DB.

-   This means that any application with the right credentials will be able to access and modify data in the databases registered inside your local MySQL instance

==================================================

**_MySQL_**

https://flaviocopes.com/mysql-how-to-install/

brew install mysql

——————

==> mysql We've installed your MySQL database without a root password. To secure it run: mysql_secure_installation

MySQL is configured to only allow connections from localhost by default

To connect run: mysql -uroot

To restart mysql after an upgrade: brew services restart mysql Or, if you don't want/need a background service you can just run: /opt/homebrew/opt/mysql/bin/mysqld_safe --datadir=/opt/homebrew/var/mysql

—————

Mysql mysql mysql mysql mysql mysql mysql mysql mysql mysql mysql mysql mysql mysql mysql mysql Mysql mysql mysql mysql mysql mysql mysql mysql mysql mysql mysql mysql mysql MySQL MySQL MySQL MySQL MySQL MySQL Run this shit!

mysql -u root -p <password>

———

➜ ~ mysql.server start Starting MySQL ... ERROR! The server quit without updating PID file (/opt/homebrew/var/mysql/Felipes-Mac-mini.local.pid). ➜ ~ mysql.server stop ERROR! MySQL server PID file could not be found!

Fix: Kill all mysql running processes and run “mysql.server start” again

➜ ~ pgrep mysql  
16196 ➜ ~ kill -15 16196 ➜ ~ pgrep mysql  
➜ ~ pgrep mysql 16326 ➜ ~ kill -15 16326 ➜ ~ pgrep mysql  
➜ ~ pgrep mysql  
16454 ➜ ~ kill -15 16454 ➜ ~ mysql.server start Starting MySQL SUCCESS! ➜ ~ 2022-03-18T23:22:54.6NZ mysqld_safe A mysqld process already exists

Our mySql CLI is working!

I’ve run this command here ➜ ~ mysql_secure_installation  
which set some security rules to our MySQL instance so every command in the CLI must include a series of flags before each statement…which is pretty annoying…

To run a query via CLI commands will look like this: mysql <user> <password> <execute> ➜ ~ mysql --user root --password --execute "show databases" OR ➜ ~ mysql -u root -p -e "show databases" OR ➜ ~ mysql -uroot -p -e "show databases"

➜ ~ mysql -u root -p -e "create database ChatApp" ➜ ~ mysql OnlineStore -uroot -p -e "select \* from Test" ➜ ~ mysql OnlineStore -uroot -p -e "insert into Test values ('Tim burton','tim@burton')"

➜ ~ mysql OnlineStore -uroot -p -e "create table pets (name varchar(255), color varchar(255), age int)" ➜ ~ mysql OnlineStore -uroot -p -e "insert into pets values ('Lolo', 'grey', 3)" ➜ ~ mysql OnlineStore -uroot -p -e "select \* from pets"

\*Theoretically I could include the password in the command to skip the password check but due to the security settings, this is considered to be a security breach and therefore an error is thrown

—————

Sometime later I went through a reinstall to reset everything and disable those annoying password prompts Now I’m able to use the CLI more efficiently

So now a recap:

~ mysql.server start

mysql> use OnlineStore mysql> select \* from test; mysql> select \* from pets;

—————————

Char (fixed length from 1 - 255 chars) Varchar (variable length from 1 - 255 chars) Text (long text)

Int Float

Date Time Datetime

https://livecodestream.dev/post/your-guide-to-building-a-nodejs-typescript-rest-api-with-mysql/
