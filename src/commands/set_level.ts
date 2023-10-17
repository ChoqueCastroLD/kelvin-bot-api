import { Client, Colors, Embed, EmbedBuilder, Events, SlashCommandBuilder } from "discord.js"
import { prisma } from "../services/prisma";

export const command = new SlashCommandBuilder() 
    .setName("set-level")
    .setDescription("set a users level")
    .addUserOption(option1 => option1.setName("target-user").setDescription("user who's info you want to see"))
    .addIntegerOption(option1 => option1.setName("target-level").setDescription("what level you want the user to be"))
    
export function handle(client: Client) {
    client.on(Events.InteractionCreate, async interaction => {
        if (!interaction.isChatInputCommand()) return;
        if (interaction.commandName !== command.name) return;

        const targetUser = interaction.options.getUser("target-user", true)
        const targetLevel = interaction.options.getInteger("target-level", true)
        await prisma.user.update({where:{discord_id:targetUser.id}, data:{level:targetLevel}})

        const setLevelEmbedBuilder = new EmbedBuilder()
        .setDescription("Successfully set " + targetUser.globalName + "'s level to " + targetLevel)
        .setColor(Colors.Green)
        await interaction.reply({embeds: [setLevelEmbedBuilder]})
    });
}