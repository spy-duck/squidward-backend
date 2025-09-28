#!/bin/sh

echo "Starting entrypoint script..."

echo "Migrating database..."

if ! npm run migrations:up; then
    echo "Database migration failed! Exiting container..."
    exit 1
fi

echo "Migrations deployed successfully!"

echo "Seeding database..."
if ! npm run migrate:seed; then
    echo "Database seeding failed! Exiting container..."
    exit 1
fi

echo "Entrypoint script completed."
exec "$@"