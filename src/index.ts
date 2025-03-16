import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { customerTools } from "./tools/customer.js";
import { customerResources } from "./resources/customer.js";
import { customerPrompts } from "./prompts/customer.js";

const server = new McpServer({
  name: "mcp-server",
  version: "1.0.0",
});

customerTools(server);
customerResources(server);
customerPrompts(server);

const transport = new StdioServerTransport();
await server.connect(transport);

console.info('{"jsonrpc": "2.0", "method": "log", "params": { "message": "Server running..." }}');
