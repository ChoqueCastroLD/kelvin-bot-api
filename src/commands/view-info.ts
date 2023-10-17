import { Client, Colors, Embed, EmbedBuilder, Events, SlashCommandBuilder } from "discord.js"
import { prisma } from "../services/prisma";
import { getOrCreateUser } from "../helpers/user";

export const command = new SlashCommandBuilder() 
    .setName("view-info")
    .setDescription("view a users info")
    .addUserOption(option1 => option1.setName("target-user").setDescription("user who's info you want to see"))
    
export function handle(client: Client) {
    client.on(Events.InteractionCreate, async interaction => {
        if (!interaction.isChatInputCommand()) return;
        if (interaction.commandName !== command.name) return;

        const targetUser = interaction.options.getUser("target-user", true)
        if(targetUser == null)
        {
            await interaction.reply({ content: "You must mention a user ", ephemeral: true });
            return
        }

        const user = await getOrCreateUser(targetUser.id, targetUser.displayName)
        let requiredXP = 5 * (Math.pow(user.level, 2)) + (50 * user.level) + 100
        const viewInfoEmbedBuilder = new EmbedBuilder()
        .setThumbnail(targetUser.avatarURL())
        .setTitle(targetUser.globalName + "'s Info")
        .setColor(Colors.DarkBlue)
        .addFields(
            {name: 'Level: ', value: String(user.level) },
            {name: 'XP: ', value: String(user.xp) + " / " + requiredXP},
            {name: 'Message Count: ', value: String(user.message_count) },
            {name: 'Balance: ', value: String(user.balance) },
        )
        await interaction.reply({embeds: [viewInfoEmbedBuilder]})
    });
}