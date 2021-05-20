const runWZStats = require('./wzStats').runWZStats;

const Discord = require('discord.js');
require('dotenv').config();

const client = new Discord.Client();

let matchData = [];
let oldData = [];
let totalKills = [];

client.on('ready', () => {
    console.log('Bot is Running...');
    runWZStats((data) => {
        let solnitMatches = data[0];
        let timmsMatches = data[1];
        let ochoaMatches = data[2];
        let scottMatches = data[3];
        let laraMatches = data[4];

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
        console.log(totalKills);
    });
    
});

client.login(process.env.BOT_TOKEN);

client.on('ready', () => {

    const generalChannel = client.channels.cache.get(process.env.ZONE_CHAT_TOKEN);

    let count = 0;
    setInterval(() => {
        
        oldData = matchData;

        runWZStats((data) => {
            let solnitMatches = data[0];
            let timmsMatches = data[1];
            let ochoaMatches = data[2];
            let scottMatches = data[3];
            let laraMatches = data[4];

            matchData = [solnitMatches, timmsMatches, ochoaMatches, scottMatches, laraMatches];
            console.log('DOING MATH');
            // Logic for who is at the top
            
            
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

            let sortedKills = killCopy.sort();

            let firstKills = killCopy.indexOf(sortedKills[0]);
            let firstPlaceName = arrayOfNames[firstKills];
            let secondPlaceName;
            let thirdPlaceName;
            let secondKills;
            let thirdKills;
            if (sortedKills[0] !== sortedKills[1]) {
                secondKills = killCopy.indexOf(sortedKills[1]);
                if (sortedKills[1] !== sortedKills[2]) {
                    thirdKills = killCopy.indexOf(sortedKills[2]);

                } else { // Tie for second place
                    let resetableKills = [...killCopy];
                    resetableKills = resetableKills.splice(secondKills, 1, -1); // Replace with -1 to keep the length the same
                    thirdKills = resetableKills.indexOf(sortedKills[2]);
                    thirdPlaceName = arrayOfNames[thirdKills];

                }
            } else { // Tie for first place
                let resetableKills = [... killCopy];
                resetableKills = resetableKills.splice(secondKills, 1, -1); // Replace with -1 to keep the length the same
                secondKills = resetableKills.indexOf(sortedKills[1]);
                secondPlaceName = arrayOfNames[secondKills];

                if (sortedKills[1] !== sortedKills[2]) {
                    thirdKills = killCopy.indexOf(sortedKills[2]);
                    thirdPlaceName = arrayOfNames[thirdKills];

                } else { // 3 way tie for first place
                    resetableKills = [...killCopy];
                    resetableKills = resetableKills.splice(thirdKills, 1, -1); // Replace with -1 to keep the length the same
                    thirdKills = resetableKills.indexOf(sortedKills[2]);
                    thirdPlaceName = arrayOfNames[thirdKills];

                }

            }

            console.log(firstPlaceName, secondPlaceName, thirdPlaceName);
            // Find the kill count that is highest and correspond it to the array of names



            // SEND EVERY 30 Minutes
            console.log('SENDING');

            const messageEmbed = new Discord.MessageEmbed()
                .setColor('#0099ff')
                .setTitle('Kill Leaderboard')
                .setDescription('This is a kill tracker for everyone on the server. Each day, every persons kills reset and begin again.')
                .setThumbnail('https://i.ytimg.com/vi/Ebmiv5hfNrg/maxresdefault.jpg')
                .addFields(
                    { name: 'Todays Leader:', value: firstPlaceName },
                    { name: '\u200B', value: '\u200B' },
                    { name: firstPlaceName, value: firstKills },
                    { name: secondPlaceName, value: secondKills },
                    { name: thirdPlaceName, value: thirdKills },
                )

            
            generalChannel.send(messageEmbed);

        });

    
    }, 1800000); // Every 30 minutes

})