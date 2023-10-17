import { Client, Colors, Embed, EmbedBuilder, Events, SlashCommandBuilder, APIEmbedField } from "discord.js"
import { prisma } from "../services/prisma";
import { getOrCreateUser } from "../helpers/user";

export const command = new SlashCommandBuilder() 
    .setName("view-leaderboard")
    .setDescription("view the top 10 users")

    console.log(prisma.user.findMany)
    
export function handle(client: Client) {
    client.on(Events.InteractionCreate, async interaction => {
        if (!interaction.isChatInputCommand()) return;
        if (interaction.commandName !== command.name) return;

        //find and sort users based on level
        const users = await prisma.user.findMany()
        for(let a = 0; a < users.length; a++)
            for(let b = 0; b < users.length - 1; b++)
                if(users[b].level < users[b + 1].level)
                {
                    let currentUsr = users[b + 1]
                    users[b + 1] = users[b]
                    users[b] = currentUsr
                }

        let leaderboardFields : APIEmbedField[] = Array(users.length)
        for(let i = 0; i < users.length;  i++)
        {
            let rank = i + 1
            leaderboardFields[i] = {name: "(" + rank + ") " + users[i].name, value:"Level: " + users[i].level}
            console.log(leaderboardFields[i].name)
        }

        const leaderboardEmbed = new EmbedBuilder()
        .setTitle(interaction.guild?.name + " Leaderboard")
        .addFields(leaderboardFields)
        .setColor(Colors.DarkBlue)
        await interaction.reply({embeds: [leaderboardEmbed]})
    })
}