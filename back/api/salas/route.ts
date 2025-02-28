import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request: Request) {
    const salas = await prisma.room.findMany()
    return Response.json({data})
}