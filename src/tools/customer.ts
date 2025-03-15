import { PrismaClient } from "@prisma/client";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

export const customerTools = (server: McpServer): void => {
    server.tool(
        'add_customer',
        'add customer by name, age, type and interests',
        { 
            name: z.string().min(1).describe('The name of the customer'),
            age: z.number().min(0).max(120).describe('The age of the customer'),
            type: z.string().optional().describe('The type of the customer'),
            interests: z.array(z.string()).optional().describe('The interests of the customer'),
        },
        async ({name, age, type = 'customer', interests = []}) => {
            const prisma = new PrismaClient();

            try {
                await prisma.customers.create({
                    data: {
                        name: name,
                        age: age,
                        type,
                        interests
                    }
                })
                
                return {
                    content: [
                        {
                            type: 'text',
                            text: `已成功加入客戶:${name},年齡${age}歲`,
                        }
                    ]
                }
            } catch (error) {
                if(error instanceof Error){
                    return {
                        isError: true,
                        content: [
                            {
                                type: "text",
                                text: `Error: ${error.message}`
                            }
                        ]
                    };
                }

                throw error
            } finally {
                await prisma.$disconnect()
            }
        }
    )
}
