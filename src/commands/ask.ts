import { Client, Events, SlashCommandBuilder, EmbedBuilder, Colors } from "discord.js"
import { prisma } from "../services/prisma";


export const command = new SlashCommandBuilder()
    .setName('ask')
    .setDescription('ask something')
    .addStringOption(option =>
        option.setName('message')
            .setDescription('Ask what you want to Kelvin')
			.setRequired(true));
// sello, yo bajo
//cara tu bajas
export function handle(client: Client) {
    client.on(Events.InteractionCreate, async interaction => {
        if (!interaction.isChatInputCommand()) return;
        if (interaction.commandName !== command.name) return;
        
        // input
        const chatId = interaction.user.id;
        const text = (interaction.user.displayName + ": " + interaction.options.getString('message')).replace(/[^a-zA-Z0-9 ]/g, '')

        const ThinkingEmbedBuilder = new EmbedBuilder()
        .setDescription("Let me have a think...")
        .setColor(Colors.DarkBlue)
        
        await interaction.reply({embeds:[ThinkingEmbedBuilder]});
        // call kelvin gpt api
        const apiURL = "https://api.sotf-mods.com/api/kelvin-gpt/prompt?chat_id=" + chatId + "&context=health:100/100&text=" + encodeURIComponent(text)

        const answerRequest = await fetch(apiURL).then(r => r.text())
        
        const answer = answerRequest.split('|')[1].replace(/[^a-zA-Z0-9 ]/g, '')

        console.log({
            chatId,
            message: text,
            answerRequest,
            answer
        })
        const responseEmbedBuilder = new EmbedBuilder()
        .setDescription("Kelvin: " + answer)
        .setColor(Colors.DarkBlue)
        // reply
        await interaction.editReply({embeds:[responseEmbedBuilder]});
    });
}