import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { customerTools } from "@/tools";
import { customerResources } from "@/resources";
import { customerPrompts } from "@/prompts";

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
