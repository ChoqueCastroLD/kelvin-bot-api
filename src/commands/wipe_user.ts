import { Client, Colors, Embed, EmbedBuilder, Events, SlashCommandBuilder } from "discord.js"
import { prisma } from "../services/prisma";
import { getOrCreateUser } from "../helpers/user";

export const command = new SlashCommandBuilder() 
    .setName("wipe-user")
    .setDescription("wipe a users data")
    .addUserOption(option1 => option1.setName("target-user").setDescription("user who's info you want to see"))

    console.log(prisma.user.findMany)
    
export function handle(client: Client) {
    client.on(Events.InteractionCreate, async interaction => {
        if (!interaction.isChatInputCommand()) return;
        if (interaction.commandName !== command.name) return;

        const targetUser = interaction.options.getUser("target-user", true)
        await prisma.user.delete({where:{discord_id:targetUser.id}}) //delete old database entry
        await getOrCreateUser(targetUser.id, targetUser.displayName) //create new database entry

        const wipeInfoEmbedBuilder = new EmbedBuilder()
        .setDescription("Wiped " + targetUser.globalName + "'s Info")
        .setColor(Colors.Green)
        await interaction.reply({embeds: [wipeInfoEmbedBuilder]})
    });
}