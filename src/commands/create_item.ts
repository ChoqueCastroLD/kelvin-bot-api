import { Client, Colors, Embed, EmbedBuilder, Events, SlashCommandBuilder } from "discord.js"
import { prisma } from "../services/prisma";

export const command = new SlashCommandBuilder() 
    .setName("create-item")
    .setDescription("adds an item to the item database")
    .addStringOption(option1 => option1.setName("item_name").setDescription("name of the item (required)"))
    .addStringOption(option2 => option2.setName("emoji_id").setDescription("emoji id (optional)"))
    .addIntegerOption(option3 => option3.setName("item_price").setDescription("value of the item (optional) will be 0 if not assigned"))
    
console.log(prisma.item.findMany)
export function handle(client: Client) {
    client.on(Events.InteractionCreate, async interaction => {
        if (!interaction.isChatInputCommand()) return;
        if (interaction.commandName !== command.name) return;

        const item_name = interaction.options.getString("item_name", true)
        const doesItemExist = await prisma.item.findFirst({where:{name:item_name}})
        if(doesItemExist){
            interaction.reply("Item already Exists")
            return
        }

        let item = await prisma.item.create({
                data:{
                    name: item_name,
                    icon: interaction.options.getString("emoji_id")?? "",
                    price: interaction.options.getInteger("item_price")?? 0
                }
            })
            
        const createItemEmbed = new EmbedBuilder()
        .setColor(Colors.Green)
        .setTitle(interaction.user.globalName + " has created a new item!")
        .setDescription("They created an item called " + (item.icon + item.name) + " with a value of " + item.price)
        await interaction.reply({embeds: [createItemEmbed]})
    });
}