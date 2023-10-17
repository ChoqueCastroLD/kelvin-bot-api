import { Client, Colors, Embed, EmbedBuilder, Events, SlashCommandBuilder } from "discord.js"
import { prisma } from "../services/prisma";
import { getOrCreateUser } from "../helpers/user";

export const command = new SlashCommandBuilder() 
    .setName("add-coins")
    .setDescription("add to a users coin balance")
    .addUserOption(option1 => option1.setName("target-user").setDescription("user who's info you want to see"))
    .addIntegerOption(option1 => option1.setName("target-coins").setDescription("how many coins you to add to the user"))
    
export function handle(client: Client) {
    client.on(Events.InteractionCreate, async interaction => {
        if (!interaction.isChatInputCommand()) return;
        if (interaction.commandName !== command.name) return;

        const targetUser = interaction.options.getUser("target-user", true)
        const targetCoins = interaction.options.getInteger("target-coins", true)
        if(targetUser == null || !targetCoins == null)
        {
            await interaction.reply("Missing Options")
            return
        }

        const dbUser = await getOrCreateUser(targetUser.id, targetUser.displayName)
        await prisma.user.update({where:{discord_id:targetUser.id}, data:{balance:dbUser.balance + targetCoins}})

        const setLevelEmbedBuilder = new EmbedBuilder()
        .setDescription("Successfully added " + targetCoins + " coins to " + targetUser.globalName)
        .setColor(Colors.Green)
        await interaction.reply({embeds: [setLevelEmbedBuilder]})
    });
}