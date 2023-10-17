import { Client, Events } from "discord.js";
import { prisma } from "../services/prisma";


export async function handle(client: Client) {
    client.once(Events.ClientReady, (c) => {
        console.log(`Ready! Logged in as ${c.user.tag}`);
    });
}