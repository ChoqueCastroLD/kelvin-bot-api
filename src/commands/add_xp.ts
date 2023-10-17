import { Client, Colors, Embed, EmbedBuilder, Events, SlashCommandBuilder } from "discord.js"
import { prisma } from "../services/prisma";
import { getOrCreateUser } from "../helpers/user";

export const command = new SlashCommandBuilder() 
    .setName("add-xp")
    .setDescription("add xp to a user")
    .addUserOption(option1 => option1.setName("target-user").setDescription("user who's info you want to see"))
    .addIntegerOption(option1 => option1.setName("target-xp").setDescription("how much xp you want to add"))
    
export function handle(client: Client) {
    client.on(Events.InteractionCreate, async interaction => {
        if (!interaction.isChatInputCommand()) return;
        if (interaction.commandName !== command.name) return;

        const targetUser = interaction.options.getUser("target-user", true)
        const targetXp = interaction.options.getInteger("target-xp", true)
        if(targetUser == null || targetXp == null){
            await interaction.reply("Missing Options")
            return
        }

        const dbUser = await getOrCreateUser(targetUser.id, targetUser.displayName)
        await prisma.user.update({where:{discord_id:targetUser.id}, data:{xp:dbUser.xp + targetXp}})
        
        const setLevelEmbedBuilder = new EmbedBuilder()
        .setDescription("Successfully added " + targetXp + " xp to " + targetUser.globalName)
        .setColor(Colors.Green)
        await interaction.reply({embeds: [setLevelEmbedBuilder]})
    });
}