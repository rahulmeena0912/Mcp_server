# mcp-server

A Model Context Protocol (MCP) server for database schema management and querying, built with Node.js and TypeScript.

## Project Structure

```
fintra-mcp-server/
│
├── src/
│   ├── controllers/
│   │   └── tools.ts          # MCP tools implementation
│   ├── data/
│   │   ├── tableDescriptions.json     # Table metadata and descriptions
│   │   └── columnDescriptions.json    # Column-level descriptions
│   ├── utils/
│   │   └── db.ts             # Database connection pool
│   ├── index.ts              # Application entry point
│   └── server.ts             # MCP server configuration
│
├── node_modules/             # Dependencies
├── dist/                     # Compiled JS output (ignored by git)
│
├── .env                      # Environment variables
├── .gitignore
├── package.json
├── tsconfig.json
├── README.md
```

## Features

- **Database Schema Discovery**: Automatically reads and exposes PostgreSQL table schemas
- **Intelligent Querying**: Provides table and column descriptions for better LLM understanding
- **MCP Protocol**: Implements Model Context Protocol for seamless AI integration
- **Type Safety**: Full TypeScript implementation with Zod validation

## Available Tools

1. **tableSchema** - Returns complete database schema with tables and columns
2. **tableSchemaDescription** - Provides detailed table descriptions and purposes
3. **tableColumnsDescription** - Returns column-level descriptions for specific tables
4. **query** - Executes SQL queries on the PostgreSQL database

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- PostgreSQL database
- npm or yarn package manager

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd fintra-mcp-server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file with your database configuration:
   ```env
   DATABASE_URL=postgresql://username:password@localhost:5432/database_name
   PORT=3000
   ```

4. Set up your table and column descriptions in the data files:
   - Edit `src/data/tableDescriptions.json` for table metadata
   - Edit `src/data/columnDescriptions.json` for column descriptions

### Development

Run the development server:
```bash
npm run dev
```

### Production

Build and run the production server:
```bash
npm run build
npm start
```

## Configuration

### Database Setup

Ensure your PostgreSQL database is accessible and the connection string in `.env` is correct. The server will automatically discover tables in the `public` schema.

### Adding Table/Column Descriptions

Update the JSON files in `src/data/` to provide better context for AI queries:

- `tableDescriptions.json`: Add table-level metadata
- `columnDescriptions.json`: Add column-level descriptions

## API Usage

This server implements the Model Context Protocol (MCP) and can be integrated with MCP-compatible clients for database querying and schema exploration.

