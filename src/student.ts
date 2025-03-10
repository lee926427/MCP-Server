import { PrismaClient } from "@prisma/client";
import { McpServer, ResourceTemplate  } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

export const setupStudent = (server: McpServer): void => {
    server.resource(
        "get_all_students",
        new ResourceTemplate("students://all", { list: undefined }),
        async (uri) => {
            const prisma = new PrismaClient();

            try {
                const students = await prisma.students.findMany({
                    take: 50
                });

                return {
                    contents: [
                    {
                        uri: uri.href,
                        text: `查詢學生結果：\n${students.map(student => `姓名：${student.name},年齡：${student.age}`).join('\n')}`,
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

    server.tool(
        'search_student',
        'search student by name or age',
        { 
            name: z.string().min(1).describe('The name of the student'),
            age: z.number().min(0).max(120).optional().describe('The age of the student'),
        },
        async ({name, age}) => {
            const prisma = new PrismaClient();
            
            try {
                const students = await prisma.students.findMany({
                    where: {
                        name: {
                            contains: name,
                            mode: 'insensitive',
                        },
                        age,
                    }
                })

                return {
                    content: [
                        {
                            type: 'text',
                            text: `查詢學生結果：\n${students.map(s => `姓名：${s.name},年齡：${s.age}`).join('\n')}`,
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

    server.tool(
        'add_student',
        'add student by name and age',
        { 
            name: z.string().min(1).describe('The name of the student'),
            age: z.number().min(0).max(120).describe('The age of the student'),
        },
        async ({name, age}) => {
            const prisma = new PrismaClient();

            try {
                await prisma.students.create({
                    data: {
                        name: name,
                        age: age,
                    }
                })
                
                return {
                    content: [
                        {
                            type: 'text',
                            text: `已成功加入學生:${name},年齡${age}歲`,
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
