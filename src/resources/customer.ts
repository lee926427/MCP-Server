import { PrismaClient } from "@prisma/client";
import { McpServer, ResourceTemplate  } from "@modelcontextprotocol/sdk/server/mcp.js";

export const customerResources = (server: McpServer): void => {
    server.resource(
        "get_all_customers",
        new ResourceTemplate("customers://all", { list: undefined }),
        async (uri) => {
            const prisma = new PrismaClient();

            try {
                const customers = await prisma.customers.findMany({
                    take: 50
                });

                return {
                    contents: [
                    {
                        uri: uri.href,
                        text: `查詢客戶結果：\n${customers.map(customer => `姓名：${customer.name},年齡：${customer.age}`).join('\n')}`,
                    }
                ]
            }
        } catch (error) {
            if(error instanceof Error){
                return {
                    isError: true,
                    contents: [
                        {
                            uri: uri.href,
                            text: `Error: ${error.message}`
                        }
                    ]
                };
            }

            throw error
        } finally {
            await prisma.$disconnect()
        }
    });
}
