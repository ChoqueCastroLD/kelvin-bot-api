import { Client } from "discord.js"
import { readdir } from 'node:fs/promises'


export const loadCommands = async (client: Client) => {
    const commands = []

    const files = (await readdir(`./src/commands`))

    for (const file of files) {
        try {
            console.log(`Loading command: ${file}`)
            const { handle, command } = await import(`./commands/${file}`)
            if (command) commands.push(command.toJSON());
            if (handle) await handle(client);
        } catch (error) {
            console.error(`Error loading command ${file}`)
            console.error(error);
        }
    }

    return commands
}