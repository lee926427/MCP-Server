import { PrismaClient } from "@prisma/client";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

export const customerPrompts = (server: McpServer): void => {
    server.prompt(
        "group_by_interest",
        "group customers by interest",
        { interests: z.string().min(1).describe("The interests of the customer, separated by commas") },
        async ({ interests }) => {
            const prisma = new PrismaClient();
            
            try {
                const customers = await prisma.customers.findMany({
                    where: { interests: { has: interests } },
                });
                
                if (!customers) {
                    return {
                        messages: [
                            {
                                role: "assistant",
                                content: {
                                    type: "text",
                                    text: `未找到客戶具有這些興趣：${interests}`,
                                },
                            }
                        ]
                    };
                }
                
                return {
                    messages: [
                        {
                            role: "user",
                            content: {
                                type: "text",
                                text: `幫我分析這些消費客戶具有什麼樣的特徵:\n${customers}`,
                            },
                        },
                        {
                            role: "assistant",
                            content: {
                                type: "text",
                                text: '還有什麼需要我幫忙的嗎？',
                            },
                        }
                    ]
                };
            } catch (error) {
                if (error instanceof Error) {
                    return {
                        isError: true,
                        messages: [
                            {
                                role: "assistant",
                                content: {
                                    type: "text",
                                    text: `Error: ${error.message}`,
                                },
                            }
                        ]
                    };
                }
                
                throw error;
            } finally {
                await prisma.$disconnect();
            }
        }
    );
}   