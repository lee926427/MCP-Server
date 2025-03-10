import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { setupStudent } from "./student.js";

const server = new McpServer({
  name: "mcp-server",
  version: "1.0.0",
});

setupStudent(server);

const transport = new StdioServerTransport();
await server.connect(transport);

console.info('{"jsonrpc": "2.0", "method": "log", "params": { "message": "Server running..." }}');
