import { Client, Colors, Events, SlashCommandBuilder, EmbedBuilder } from "discord.js"
import { prisma } from "../services/prisma";
import { getOrCreateUser } from "../helpers/user";


export const command = new SlashCommandBuilder()
    .setName('play-dice')
    .setDescription('play dice with a bot')
    .addIntegerOption(bid => bid.setName("bid_amount").setDescription("amount that you wish to bet"))

export function handle(client: Client) {
    client.on(Events.InteractionCreate, async interaction => {
        if (!interaction.isChatInputCommand()) return;
        if (interaction.commandName !== command.name) return;

        const bidAmount = interaction.options.getInteger("bid_amount", true)
        const user = await getOrCreateUser(interaction.user.id, interaction.user.displayName)
        if(!bidAmount)
        {
            await interaction.reply({ content: "You must enter a bid amount", ephemeral: true });
            return
        }
        else if(user.balance < bidAmount)
        {
            await interaction.reply({ content: "You do not have enough coins", ephemeral: true });
            return
        }

        const userThrowA = Math.round(Math.random() * (6 - 1) + 1)
        const userThrowB = Math.round(Math.random() * (6 - 1) + 1)
        const playerTotal = userThrowA + userThrowB

        const playerThrowEmbed = new EmbedBuilder()
        .setColor(Colors.DarkBlue)
        .setTitle(interaction.user.globalName + " has thrown a dice!")
        .setDescription("They got " + userThrowA + " and a " + userThrowB)

        await interaction.reply({embeds: [playerThrowEmbed]})

        const botThrowA = Math.round(Math.random() * (6 - 1) + 1)
        const botThrowB = Math.round(Math.random() * (6 - 1) + 1)
        const botTotal = botThrowA + botThrowB

        const botThrowEmbed = new EmbedBuilder()
        .setColor(Colors.DarkBlue)
        .setTitle(interaction.user.globalName + "'s opponent has thrown a dice!")
        .setDescription("They got " + botThrowA + " and a " + botThrowB)
        interaction.followUp({embeds: [botThrowEmbed]})

        if(playerTotal == botTotal)
        {
            const drawEmbed = new EmbedBuilder()
            .setColor(Colors.Grey)
            .setDescription("Draw, no one has won anything")
            interaction.followUp({embeds: [drawEmbed]})
        }
        else if(playerTotal > botTotal)
        {
            const userWinEmbed = new EmbedBuilder()
            .setColor(Colors.Green)
            .setDescription(interaction.user.globalName + " has won " + bidAmount * 2 + " coins!")
            interaction.followUp({embeds: [userWinEmbed]})
            await prisma.user.update({where:{discord_id: interaction.user.id}, data:{balance:user.balance + bidAmount * 2}})
        }
        else
        {
            const userloseEmbed = new EmbedBuilder()
            .setColor(Colors.Red)
            .setDescription(interaction.user.globalName + " has lost " + bidAmount  + " coins")
            interaction.followUp({embeds: [userloseEmbed]})
            await prisma.user.update({where:{discord_id: interaction.user.id}, data:{balance:user.balance - bidAmount}})
        }


    });
}