import { prisma } from "../services/prisma";


export async function getOrCreateUser(discord_id: string, username: string) {
    const user = await prisma.user.findUnique({
        where: {
            discord_id
        }
    })
    if (user && username && (user?.name !== username)) {
        return await prisma.user.update({
            where: {
                discord_id
            },
            data: {
                name: username
            }
        })
    }
    if (user) {
        return user
    }
    return await prisma.user.create({
        data: {
            discord_id,
            name: username,
            balance: 0,
            xp: 0,
            level: 0,
        }
    })
}