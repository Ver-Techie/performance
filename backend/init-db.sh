#!/bin/bash

# Check if required environment variables are set
if [ -z "$SUPABASE_URL" ] || [ -z "$SUPABASE_ANON_KEY" ]; then
    echo "Error: SUPABASE_URL and SUPABASE_ANON_KEY must be set"
    exit 1
fi

# Create a temporary file with the SQL commands
TEMP_FILE=$(mktemp)

# Add the schema SQL to the temporary file
cat src/db/schema.sql > "$TEMP_FILE"

# Execute the SQL commands using Supabase CLI
supabase db reset --db-url "$SUPABASE_URL" --schema-file "$TEMP_FILE"

# Clean up
rm "$TEMP_FILE"

echo "Database initialized successfully!" 