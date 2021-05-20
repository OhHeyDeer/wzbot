const runWZStats = require('./wzStats').runWZStats;

const Discord = require('discord.js');
require('dotenv').config();

const client = new Discord.Client();

let matchData = [];
let oldData = [];

client.on('ready', () => {
    console.log('Bot is Running...');
    runWZStats((data) => {
        let solnitMatches = data[0];
        let timmsMatches = data[1];
        let laraMatches = data[2];

        matchData = [solnitMatches, timmsMatches, laraMatches];
    });
    
});
client.login(process.env.BOT_TOKEN);

client.on('ready', () => {

    // Who is playing:

    

    const generalChannel = client.channels.cache.get(env.process.ZONE_CHAT_TOKEN);

    let count = 0;
    setInterval(() => {
        
        oldData = matchData;

        runWZStats((data) => {
            let solnitMatches = data[0];
            let timmsMatches = data[1];
            // let laraMatches = data[2];
            let scottMatches = data[3];
            let ochoaMatches = data[2];

            matchData = [solnitMatches, timmsMatches, ochoaMatches, scottMatches];
            console.log('DOING MATH');
            // Logic for who is at the top
            // let juancaKills = matchData[2][0].playerStats.kills;

            
            // Who is playing:
            let solnitKills = matchData[0][0].playerStats.kills;
            let timmsKills = matchData[1][0].playerStats.kills;
            let ochoaKills = matchData[2][0].playerStats.kills;
            let scottKills = matchData[3][0].playerStats.kills;

            const arrayOfKills = [solnitKills, timmsKills, ochoaKills, scottKills];

            let largestKillCount = Math.max(...arrayOfKills);

            let gamemode = '';
            if (matchData[0][0].mode === 'br_brquads') {
                gamemode = 'BR Quads'
            } else if (matchData[0][0].mode === 'br_brtrios') {
                gamemode = 'BR Trios'
            }

            if (JSON.stringify(oldData[0]) !== JSON.stringify(matchData[0]) || count === 0) {
                console.log('SENDING');
                generalChannel.send('Game Summary: \n Gamemode: '+ gamemode + ' KILL WINNER: ' + largestKillCount + ' \n| BraidMyNutHair - ' + solnitKills +
                ' kills |\n | CheekSlapper6000 - ' + timmsKills +
                ' kills |\n | CHA-TITY - ' + ochoaKills + 
                ' kills |\n | ScottyOnPC - ' + scottKills + 
                ' kills |');
            }
            count++;
        });

    
    }, 60000);

})