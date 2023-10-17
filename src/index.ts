import { Elysia } from 'elysia'
import { cors } from '@elysiajs/cors'
import { Client, REST, Routes, GatewayIntentBits } from 'discord.js';

import { router } from './router'
import { loadCommands } from './commands'
import { onMessage } from './events/on_message'
import { prisma } from './services/prisma';


const app = new Elysia()
    .use(cors())
    .use(router)
    .listen(Bun.env.PORT ?? 3000)

console.log(
    `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
)

// Load discord bot
export const client = new Client({intents: ['Guilds', 'GuildMessages', 'MessageContent', 'GuildMembers',]})

console.log('\nDiscord bot - loading commands')
const commands = await loadCommands(client)
//message event thingy
await onMessage(client)

console.log('\nDiscord bot - uploading commands')
const rest = new REST({ version: '10' }).setToken("" + Bun.env.DISCORD_TOKEN)
// upload commands
await rest.put(Routes.applicationCommands("" + Bun.env.DISCORD_CLIENT_ID), { body: commands })

console.log('\nDiscord bot - loggin in')
await client.login("" + Bun.env.DISCORD_TOKEN)
 
console.log('\n\n✅ Discord bot loaded and running ✅');
//await await prisma.user.deleteMany({})
