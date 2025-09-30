#!/bin/sh

echo "Starting entrypoint script..."

echo "Migrating database..."

if ! npm run migrations:up:prod; then
    echo "Database migration failed! Exiting container..."
    exit 1
fi

echo "Migrations deployed successfully!"

echo "Entrypoint script completed."

exec "$@"