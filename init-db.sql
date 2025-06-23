-- PostgreSQL initialization script for AirbnbAI database
-- This script sets up the database with proper extensions and initial configuration

-- Create extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Set timezone
SET timezone = 'UTC';

-- Create indexes for better performance (will be created by EF migrations)
-- But we can set up some initial configuration

-- Grant permissions
GRANT ALL PRIVILEGES ON DATABASE "AirbnbAI" TO airbnb;
