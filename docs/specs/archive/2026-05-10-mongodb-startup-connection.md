# MongoDB Startup Connection

## Goal

The server should establish a MongoDB connection when the Express app is loaded, using connection values already supplied through environment variables.

## Behavior

- Load environment variables before reading MongoDB configuration.
- If `MONGODB_URI` is set, connect with Mongoose.
- If `MONGODB_DBNAME` is set, pass it as the selected database name.
- Log `MongoDB connected successfully` after a successful connection.
- If `MONGODB_URI` is missing, warn and continue without connecting.
- If connection fails, log the connection error.

## Non-goals

- Replacing the current in-memory auth implementation with MongoDB persistence.
- Changing route behavior or API response contracts.
- Introducing a new database library or dependency.
