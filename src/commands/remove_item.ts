import { Client, Colors, Events, SlashCommandBuilder, EmbedBuilder } from "discord.js"
import { prisma } from "../services/prisma";

export const command = new SlashCommandBuilder() 
    .setName("remove-item")
    .setDescription("removes an item from the item database")
    .addStringOption(option1 => option1.setName("item_name").setDescription("item name (required)"))

export function handle(client: Client) {
    client.on(Events.InteractionCreate, async interaction => {
        if (!interaction.isChatInputCommand()) return;
        if (interaction.commandName !== command.name) return;
        const targetItem = interaction.options.getString("item_name", true)
        const item = await prisma.item.findFirst({where:{name: targetItem}})
        if(item == null)
        {
            await interaction.reply("item not found")
            return
        }

        const deleteItemEmbed = new EmbedBuilder()
        .setColor(Colors.Red)
        .setTitle(interaction.user.globalName + " has deleted an item!")
        .setDescription("They deleted an item called " + (item.icon + item.name))
        await interaction.reply({embeds: [deleteItemEmbed]})
        await prisma.item.deleteMany({where:{name: targetItem}})
    });
}