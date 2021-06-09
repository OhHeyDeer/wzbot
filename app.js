const runWZStats = require('./wzStats').runWZStats;

const Discord = require('discord.js');
require('dotenv').config();

const client = new Discord.Client();

let matchData = [];
let oldData = [];
let totalKills = [];
// const inputString = (prompt('Who is Playing today?')).split(' ');

client.on('ready', () => {
    console.log('Bot is Running...');
    
    runWZStats((data) => {

        let solnitMatches = data[0]; // BS
        let timmsMatches = data[1]; // NT
        let ochoaMatches = data[2]; // JO
        let scottMatches = data[3]; // SG
        let laraMatches = data[4]; // JL


        matchData = [solnitMatches, timmsMatches, ochoaMatches, scottMatches, laraMatches];
        totalKills = [0,0,0,0,0];

        // Check each set of matches and add together the kills from only todays matches.
        for(let i = 0; i < matchData.length; i++) { // Iterate through the array of everyones matches
            let currentKills = 0;
            for(let j = 0; j < matchData[i].length; j++) { // Iterate through each array of matches
                if (new Date(matchData[i][j].utcStartSeconds).getUTCDay() === (new Date()).getUTCDay()) {
                    currentKills += matchData[i][j].playerStats.kills;
                }
            }
            totalKills[i] += currentKills;
        }
    });
    
});

client.login(process.env.BOT_TOKEN);

client.on('ready', () => {

    const generalChannel = client.channels.cache.get(process.env.ZONE_CHAT_TOKEN);

    let oldTotal;
    setInterval(() => {
        
        oldData = matchData;
        oldTotal = totalKills;

        runWZStats((data) => {
            let solnitMatches = data[0];
            let timmsMatches = data[1];
            let ochoaMatches = data[2];
            let scottMatches = data[3];
            let laraMatches = data[4];

            matchData = [solnitMatches, timmsMatches, ochoaMatches, scottMatches, laraMatches];
            console.log('DOING MATH');
            
            
            // Who is playing:
            let solnitKills = matchData[0][0].playerStats.kills;
            let timmsKills = matchData[1][0].playerStats.kills;
            let ochoaKills = matchData[2][0].playerStats.kills;
            let scottKills = matchData[3][0].playerStats.kills;
            let juancaKills = matchData[4][0].playerStats.kills;

            // Add prior match stats ONLY if they change
            if (JSON.stringify(oldData[0]) !== JSON.stringify(matchData[0])) { // SOLNIT
                totalKills[0] += solnitKills;
            }
            if (JSON.stringify(oldData[1]) !== JSON.stringify(matchData[1])) { // TIMMS
                // change the kill count
                totalKills[1] += timmsKills;
            }
            if (JSON.stringify(oldData[2]) !== JSON.stringify(matchData[2])) { // OCHOA
                // change the kill count
                totalKills[2] += ochoaKills;
            }
            if (JSON.stringify(oldData[3]) !== JSON.stringify(matchData[3])) { // SCOTT
                // change the kill count
                totalKills[3] += scottKills;
            }
            if (JSON.stringify(oldData[4]) !== JSON.stringify(matchData[4])) { // JUANCA
                // change the kill count
                totalKills[4] += juancaKills;
            }

            // Add to a total count for each user

            // let gamemode = '';
            // if (matchData[0][0].mode === 'br_brquads') {
            //     gamemode = 'BR Quads'
            // } else if (matchData[0][0].mode === 'br_brtrios') {
            //     gamemode = 'BR Trios'
            // } else if (matchData[0][0].mode === 'br_brduos') {
            //     gamemode = 'BR Duos'
            // }

            let arrayOfNames = [
                'BraidMyNutHair',
                'CheekSlapper6000',
                'CHA-TITY',
                'ScottyOnPC',
                'Lara999'
            ]
            // Have a copy of the kills array, reorder it to be asceding
            let killCopy = [...totalKills];

            let sortedKills = killCopy.sort((a,b) => b-a);

            let firstKillsIndex = killCopy.indexOf(sortedKills[0]);
            let secondKillsIndex;
            let thirdKillsIndex;

            let firstPlaceName = arrayOfNames[firstKillsIndex];
            let secondPlaceName;
            let thirdPlaceName;

            let firstPlaceKills = sortedKills[0];
            let secondPlaceKills = sortedKills[1];
            let thirdPlaceKills = sortedKills[2];

            if (sortedKills[0] !== sortedKills[1]) { // No Tie for First Place
                
                if (sortedKills[1] !== sortedKills[2]) { // No Tie for second place
                    secondKillsIndex = killCopy.indexOf(sortedKills[1]); // Second is Second
                    secondPlaceName = arrayOfNames[secondKillsIndex]; // Set the name to be correct

                    if (sortedKills[2] !== sortedKills[3]) { // No Tie for 3rd place
                        thirdKillsIndex = killCopy.indexOf(sortedKills[2]); // Third Is Third
                        thirdPlaceName = arrayOfNames[thirdKillsIndex];
                    } else { // Tie for third place
                        let resetableKills = [...killCopy];

                        let killIndexTemporary = resetableKills.indexOf(sortedKills[2]);
                        resetableKills.splice(killIndexTemporary, 1 , -1); // Replace the kill value in the temp array with -1 to get second index
                        let killIndexTemporary1 = resetableKills.indexOf(sortedKills[3]);

                        thirdPlaceName = 'Tied Between: ' + (arrayOfNames[killIndexTemporary]) + ' and ' + (arrayOfNames[killIndexTemporary1]) + '!';
                    }
                } else { // Tie for Second place
                    let resetableKills = [...killCopy];

                    let killIndexTemporary = resetableKills.indexOf(sortedKills[1]);
                    resetableKills.splice(killIndexTemporary, 1, -1); // Replace the kill value in the temp array with -1 to get second index
                    let killIndexTemporary1 = resetableKills.indexOf(sortedKills[2]);

                    secondPlaceName = 'Tied Between: ' + (arrayOfNames[killIndexTemporary]) + ' and ' + (arrayOfNames[killIndexTemporary1]) + '!';

                    if (sortedKills[2] !== sortedKills[3]) { // No tie for third place
                        thirdKillsIndex = killCopy.indexOf(sortedKills[2]); // Third Is Third
                        thirdPlaceName = arrayOfNames[thirdKillsIndex];
                    } else { // Tie for third place
                        let resetableKills = [...killCopy];

                        let killIndexTemporary = resetableKills.indexOf(sortedKills[2]);
                        resetableKills.splice(killIndexTemporary, 1, -1); // Replace the kill value in the temp array with -1 to get second index
                        let killIndexTemporary1 = resetableKills.indexOf(sortedKills[3]);

                        thirdPlaceName = 'Tied Between: ' + (arrayOfNames[killIndexTemporary]) + ' and ' + (arrayOfNames[killIndexTemporary1]) + '!';
                    }

                }
            } else { // Tie for first place
                let resetableKills = [...killCopy];

                let killIndexTemporary = resetableKills.indexOf(sortedKills[0]);
                resetableKills.splice(killIndexTemporary, 1, -1); // Replace the kill value in the temp array with -1 to get second index
                let killIndexTemporary1 = resetableKills.indexOf(sortedKills[1]);

                firstPlaceName = 'Tied Between: ' + (arrayOfNames[killIndexTemporary]) + ' and ' + (arrayOfNames[killIndexTemporary1]) + '!';

                if (sortedKills[1] !== sortedKills[2]) { // No tie for second place
                    secondKillsIndex = killCopy.indexOf(sortedKills[1]);
                    secondPlaceName = arrayOfNames[secondKillsIndex];

                    if (sortedKills[2] !== sortedKills[3]) { // No tie for third place
                        thirdKillsIndex = killCopy.indexOf(sortedKills[2]); // Third Is Third
                        thirdPlaceName = arrayOfNames[thirdKillsIndex];
                    } else { // Tie for third place
                        let resetableKills = [...killCopy];

                        let killIndexTemporary = resetableKills.indexOf(sortedKills[2]);
                        resetableKills.splice(killIndexTemporary, 1, -1); // Replace the kill value in the temp array with -1 to get second index
                        let killIndexTemporary1 = resetableKills.indexOf(sortedKills[3]);

                        thirdPlaceName = 'Tied Between: ' + (arrayOfNames[killIndexTemporary]) + ' and ' + (arrayOfNames[killIndexTemporary1]) + '!';
                    }

                } else { // Tie for second place
                    let resetableKills = [...killCopy];

                    let killIndexTemporary = resetableKills.indexOf(sortedKills[1]);
                    resetableKills.splice(killIndexTemporary, 1, -1); // Replace the kill value in the temp array with -1 to get second index
                    let killIndexTemporary1 = resetableKills.indexOf(sortedKills[2]);

                    secondPlaceName = 'Tied Between: ' + (arrayOfNames[killIndexTemporary]) + ' and ' + (arrayOfNames[killIndexTemporary1]) + '!';
                    
                    if (sortedKills[2] !== sortedKills[3]) { // No tie for third place
                        thirdKillsIndex = killCopy.indexOf(sortedKills[2]); // Third Is Third
                        thirdPlaceName = arrayOfNames[thirdKillsIndex];
                    } else { // Three way tie
                        let resetableKills = [...killCopy];

                        let killIndexTemporary = resetableKills.indexOf(sortedKills[2]);
                        resetableKills.splice(killIndexTemporary, 1, -1); // Replace the kill value in the temp array with -1 to get second index
                        let killIndexTemporary1 = resetableKills.indexOf(sortedKills[3]);

                        thirdPlaceName = 'Tied Between: ' + (arrayOfNames[killIndexTemporary]) + ' and ' + (arrayOfNames[killIndexTemporary1]) + '!';
                    }
                }

            }

            console.log(firstPlaceName, secondPlaceName, thirdPlaceName);
            console.log(firstPlaceKills, secondPlaceKills, thirdPlaceKills);
            // Find the kill count that is highest and correspond it to the array of names

            // SEND EVERY 30 Minutes
            console.log('Doing Math.');

            let count = 0;
            if (JSON.stringify(oldTotal) !== JSON.stringify(totalKills) || count === 0 ) { // This is an issu
                count ++;
                console.log("Sending...");
                const messageEmbed = new Discord.MessageEmbed()
                    .setColor('#0099ff')
                    .setTitle('Kill Leaderboard')
                    .setDescription('This is a kill tracker for everyone on the server. Each day, every persons kills reset and begin again.')
                    .setThumbnail('https://i.ytimg.com/vi/Ebmiv5hfNrg/maxresdefault.jpg')
                    .addFields(
                        { name: 'Todays Leader:', value: firstPlaceName },
                        { name: '\u200B', value: '\u200B' },
                        { name: firstPlaceName, value: firstPlaceKills },
                        { name: secondPlaceName, value: secondPlaceKills },
                        { name: thirdPlaceName, value: thirdPlaceKills },
                    )
    
                generalChannel.send(messageEmbed);
            }
        });

    
    }, 60000); // Every 1 minutes

})
