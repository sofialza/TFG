#!/bin/bash

MYSQL_DIR="$HOME/mysql_data"
SOCKET_FILE="$HOME/mysql.sock"
PID_FILE="$HOME/mysql.pid"

if [ ! -d "$MYSQL_DIR" ]; then
  echo "Initializing MySQL database..."
  mkdir -p "$MYSQL_DIR"
  
  mariadb-install-db \
    --datadir="$MYSQL_DIR" \
    --auth-root-authentication-method=socket \
    --skip-test-db 2>/dev/null || {
    
    mysql_install_db --datadir="$MYSQL_DIR" --user=$USER 2>/dev/null || {
      echo "Creating minimal MySQL directory structure..."
      mkdir -p "$MYSQL_DIR"/{mysql,test}
    }
  }
fi

if [ -f "$PID_FILE" ]; then
  OLD_PID=$(cat "$PID_FILE")
  if kill -0 "$OLD_PID" 2>/dev/null; then
    echo "MySQL already running with PID $OLD_PID"
    exit 0
  fi
  rm -f "$PID_FILE"
fi

echo "Starting MySQL server..."
mariadbd \
  --datadir="$MYSQL_DIR" \
  --socket="$SOCKET_FILE" \
  --pid-file="$PID_FILE" \
  --port=3306 \
  --bind-address=127.0.0.1 \
  --skip-networking=0 \
  --default-storage-engine=InnoDB \
  2>&1 &

sleep 3

if [ -S "$SOCKET_FILE" ]; then
  echo "MySQL is running!"
  
  mariadb -u root --socket="$SOCKET_FILE" -e "CREATE DATABASE IF NOT EXISTS eventos_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;" 2>/dev/null || true
  
  echo "Database 'eventos_db' ready!"
else
  echo "Warning: MySQL socket not found, may need manual start"
fi
