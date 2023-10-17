import { Client } from 'discord.js';
import {getOrCreateUser} from '../helpers/user'
import { prisma } from '../services/prisma';
import { diff } from 'semver';

export const onMessage = async (client: Client) =>
{
    client.on("messageCreate", async message => {
        const user = message.author
        if(user && !message.author.bot)
        {
            let dbUser = (await getOrCreateUser(user.id, user.displayName))

            //add xp to user based on time since last message
            const previousMsgTime = dbUser.lastmessage_time
            //Update last msg time after assigning to previousMsgTime
            await prisma.user.update({where:{discord_id: user.id}, data:{lastmessage_time:new Date()}})
            const currentmsgTime = new Date()
            const difference = Math.abs((Number(currentmsgTime) - Number(previousMsgTime)) / 1000)

            if(difference >= 3)
            {
                await prisma.user.update({where:{discord_id: user.id}, data:{xp:dbUser.xp + Math.random() * (25 - 15) + 15}})
                dbUser = (await getOrCreateUser(user.id, user.displayName))
            }

            //calculate required xp
            let requiredXP = 5 * (Math.pow(dbUser.level, 2)) + (50 * dbUser.level) + 100

            for(let userXP = dbUser.xp; userXP >= requiredXP; userXP + requiredXP)
            {
                var extraXP = userXP - requiredXP;
                await prisma.user.update({where:{discord_id: user.id}, data:{xp:extraXP}})
                await prisma.user.update({where:{discord_id: user.id}, data:{level:dbUser.level + 1}})
                dbUser = (await getOrCreateUser(user.id, user.displayName))
                requiredXP = 5 * (Math.pow(dbUser.level, 2)) + (50 * dbUser.level) + 100
            }

            //Increase message count by 1
            await prisma.user.update({where:{discord_id: user.id}, data:{message_count:dbUser.message_count + 1}})

            //print user stats to the console
            console.log(user.globalName + " has " + dbUser.message_count + " messages")
            console.log(user.globalName + " has " + dbUser.balance + " coins")
            console.log(user.globalName + " is level  " + dbUser.level)
            console.log(user.globalName + " has " + dbUser.xp + "/" + requiredXP)
            
        }
    
    });
}