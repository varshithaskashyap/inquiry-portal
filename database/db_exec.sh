read -p "Enter username: " user
read -p "Enter password: " password

mysql --user="$user" --password="$password" --execute='SOURCE database/db.sql;'