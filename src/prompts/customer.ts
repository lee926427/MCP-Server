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
                            role: "assistant",
                            content: {
                                type: "text",
                                text: `查詢客戶結果：\n${customers.map(customer => `姓名：${customer.name},年齡：${customer.age},興趣：${customer.interests.join(', ')}`).join('\n')}`,
                            }
                        },
                        {
                            role: "user",
                            content: {
                                type: "text",
                                text: '這些消費客戶具有什麼樣的共同特徵?',
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