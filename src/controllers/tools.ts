import { z } from "zod";
import { pool } from "../utils/db";
import { readFileSync } from "fs";
import { join } from "path";

const readDatabaseTables = async () => {
  const client = await pool.connect();
  try {
    const tables = await client.query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `);
    const schema = [];
    for (const row of tables.rows) {
      const table = row.table_name;
      const columns = await client.query(`
        SELECT column_name, data_type
        FROM information_schema.columns
        WHERE table_name = $1;
      `, [table]);
      schema.push(
        `${table}:\n` +
        columns.rows.map(c => `  - ${c.column_name} (${c.data_type})`).join("\n")
      );
    }
    return `${schema.join("\n\n")}`;
  } catch (e) {
    return "error in reading the resources";
  } finally {
    client.release();
  }
};

const getTableDescription = () => {
  try {
    const filePath = join(process.cwd(), 'src', 'data', 'tableDescriptions.json');
    const fileContent = readFileSync(filePath, 'utf-8');
    return JSON.parse(fileContent);
  } catch (error) {
    console.error('Error reading table descriptions:', error);
    return {};
  }
}

const getTableColumnsDescription = () => {
  try {
    const filePath = join(process.cwd(), 'src', 'data', 'columnDescriptions.json');
    const fileContent = readFileSync(filePath, 'utf-8');
    return JSON.parse(fileContent);
  } catch (error) {
    console.error('Error reading column descriptions:', error);
    return {};
  }
}

export class McpServerTools {
  
  getTableSchemaTool() {
    return {
      name: "tableSchema",
      description: "Returns the available Table Schema in the Database use this to query database",
      execute: async () => {
        const tableSchem = await readDatabaseTables();
        return String(tableSchem);
      },
    };
  }

  getTableSchemaDescriptionTool() {
    return {
      name: "tableSchemaDescription",
      description: "Returns the description and columns name of some of the tables from tableSchema use this while querying database for better results",
      execute: async () => {
        const tableDescriptions = getTableDescription();
        return JSON.stringify(tableDescriptions, null, 2);
      }
    };
  }

  getTableColumnsDescriptionTool() {
    return {
      name: "tableColumnsDescription",
      description: "Returns the available description of some of the columns from tableSchema use this while querying database for better results here tableName is name of the table",
      parameters: z.object({
        tableName: z.string(),
      }),
      execute: async (args: { tableName: string }) => {
        const tableName = args.tableName;
        if(tableName) {
          const tableColumnsDescription = getTableColumnsDescription();
          const tableColumn = tableColumnsDescription[tableName as keyof typeof tableColumnsDescription];
          
          if (tableColumn) {
            return JSON.stringify(tableColumn, null, 2);
          } else {
            return `No column descriptions found for table: ${tableName}`;
          }
        }
        else return "Please provide valid table name";
      }
    };
  }

  getQueryTool() {
    return {
      name: "query",
      description: "Execute SQL queries on the PostgreSQL database",
      parameters: z.object({
        sql: z.string(),
      }),
      execute: async (arg: { sql: string }) => {
        const client = await pool.connect();
        try {
          console.log("Executing SQL:", arg.sql);
          const result = await client.query(arg.sql);
          return String(JSON.stringify(result.rows, null, 2));
        } catch (e) {
          return String("Error");
        } finally {
          client.release();
        }
      },
    }
  }
}