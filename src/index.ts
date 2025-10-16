import { server } from "./server";
import { McpServerTools } from "./controllers/tools";

const mcpServerTool = new McpServerTools();

server.addTool(mcpServerTool.getTableSchemaTool());
server.addTool(mcpServerTool.getTableSchemaDescriptionTool());
server.addTool(mcpServerTool.getTableColumnsDescriptionTool());
server.addTool(mcpServerTool.getQueryTool());

server.start({
  transportType: "httpStream",
  httpStream: {
    port: 8080,
  },
});