const runWZStats = require('./COD_API').requestData;

const createHTMLImage = require('./customWarzonePost');

const Discord = require('discord.js');
require('dotenv').config();

const client = new Discord.Client();

let matchData = [];
let oldData = [];
let totalKills = [];
let leaderboard = {};

// Make a KillCount leaderboard that will update 

client.on('ready', () => {
    console.log('Bot is Running...');
    
    runWZStats((data) => {

        let solnitMatches = data[0]; // BS
        let timmsMatches = data[1]; // NT
        let ochoaMatches = data[2]; // JO
        let scottMatches = data[3]; // SG
        let laraMatches = data[4]; // JL
        let mikeMatches = data[5]; // MK
        let katzKills = data[6]; // BK


        matchData = [solnitMatches, timmsMatches, ochoaMatches, scottMatches, laraMatches, /* mikeMatches, katzKills */];
        totalKills = [0,0,0,0,0];

        // Check each set of matches and add together the kills from only todays matches.
        for(let i = 0; i < matchData.length; i++) { // Iterate through the array of everyones matches
            let currentKills = 0;
            for(let j = 0; j < matchData[i].length; j++) { // Iterate through each array of matches
                if (new Date(matchData[i][j].utcStartSeconds).getUTCDay() === (new Date()).getUTCDay()) {  // TURNED ON PER DAY -- TEST THIS SOON
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

        oldLeaderboard = leaderboard;

        runWZStats((data) => {

            let solnitMatches = data[0]; // BS
            let timmsMatches = data[1]; // NT
            let ochoaMatches = data[2]; // JO
            let scottMatches = data[3]; // SG
            let laraMatches = data[4]; // JL
            let mikeMatches = data[5]; // MK
            let katzMatches = data[6]; // BK

            matchData = [solnitMatches, timmsMatches, ochoaMatches, scottMatches, laraMatches, /* mikeMatches, katzMatches */ ];
            console.log('DOING MATH');
            
            
            // Who is playing:
            let solnitKills = matchData[0][0].playerStats.kills;
            let timmsKills = matchData[1][0].playerStats.kills;
            let ochoaKills = matchData[2][0].playerStats.kills;
            let scottKills = matchData[3][0].playerStats.kills;
            let juancaKills = matchData[4][0].playerStats.kills;
            // let mikeKills = matchData[5][0].playerStats.kills;
            // let katzKills = matchData[6][0].playerStats.kills;

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
            // if (JSON.stringify(oldData[5]) !== JSON.stringify(matchData[5])) { // MIKE
            //     // change the kill count
            //     totalKills[4] += mikeKills;
            // }
            // if (JSON.stringify(oldData[6]) !== JSON.stringify(matchData[6])) { // MIKE
            //     // change the kill count
            //     totalKills[4] += katzKills;
            // }


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
                'Lara999',
                'mikehaaawk25',
                'mole on left nut'
            ]


            // -----------------------------------------------------------------------------
            // Have a copy of the kills array, reorder it to be asceding
            let killCopy = [...totalKills];

            let sortedKills = killCopy.sort((a,b) => b-a);
            // Get the corresponding index of each killCount --> Person

            // Iterate through the sortedKills, getting the corresponding index within the original killCopy
            // Then taking this index to find the name of the player within arrayOfNames
            let temporaryIndex;
            let temporaryKills;
            let leaderboard = {}; // Hold the data for the leaderboard (place, name, kills)

            for(let i = 0; i < sortedKills.length; i++) {
                temporaryKills = sortedKills[i];
                temporaryIndex = killCopy.indexOf(temporaryKills);
                leaderboard[i + 1] = {name: arrayOfNames[temporaryIndex], kills: temporaryKills};

                // Remove the values that are complete as they will confuse the indexOf function if there is a tie
                killCopy.splice(temporaryIndex, 1, -1); // Replace with -1 so there are no conflicts
            }
            
            console.log(leaderboard);

            console.log('Determining whether to send a new message...');


            if (JSON.stringify(oldLeaderboard) !== JSON.stringify(leaderboard)) { // This is an issue? changed to 
                console.log("Sending...");

                createHTMLImage(leaderboard)
                    .then(data => generalChannel.send(new Discord.MessageAttachment(data)))
                    .catch(err => console.log(err));


                


                // const messageEmbed = new Discord.MessageEmbed()
                //     .setColor('#0099ff')
                //     .setTitle('Kill Leaderboard')
                //     .setDescription('This is a daily kill tracker for everyone on the server. Each day your kills reset to 0.\n(If your name is not listed I need to add you to the bot)')
                //     .setThumbnail('https://i.ytimg.com/vi/Ebmiv5hfNrg/maxresdefault.jpg')
                //     .addFields(
                //         { name: '---------- Todays Leader: ----------', value: '---------> ' + leaderboard[1].name + ' <---------' },
                //         { name: '\u200B', value: '\u200B' },
                //         { name: '1st: ' + leaderboard[1].name, value: leaderboard[1].kills },
                //         { name: '2nd: ' + leaderboard[2].name, value: leaderboard[2].kills },
                //         { name: '3rd: ' + leaderboard[3].name, value: leaderboard[3].kills },
                //         { name: '4th: ' + leaderboard[4].name, value: leaderboard[4].kills },
                //         { name: '5th: ' + leaderboard[5].name, value: leaderboard[5].kills },
                //     )
    
                // generalChannel.send(messageEmbed);
            } else {
                console.log('Not Sending...');
            }
        });

    
    }, 60000); // Every 10 minutes (600,000 is ten minutes) * 3 would be thirty minutes

})
