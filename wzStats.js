const API = require('call-of-duty-api')({ platform: "xbl" });
require('dotenv').config();

// Initialize the API

const runWZStats = (callback) => {
    API.login(process.env.USERNAME, process.env.PASSWORD)
        .then(() => { console.log('Complete'); getWZRecentMatches(callback)})
        .catch((err) => console.log("error", err));
}


const getWZRecentMatches = (callback) => {
    
    let recentMatchDataTIMMS;
    // Timms
    API.MWcombatwz(process.env.NOFREG, process.env.NOFREG_PLATFORM)
        .then(data => {
            recentMatchDataTIMMS = data.matches; 

            // console.log('Timms Game 1:', recentMatchDataTIMMS[0]);
            // Every 30 seconds, check if the matches have changed. Determine which is newest and reset data.
            let recentMatchDataSOLNIT;
            
            // Solnit
            API.MWcombatwz(process.env.SOLNIT, process.env.SOLNIT_PLATFORM)
                .then( (data1) => {
                    recentMatchDataSOLNIT = data1.matches;
        
                    let recentMatchDataOCHOA;
                    API.MWcombatwz(process.env.OCHOA, process.env.OCHOA_PLATFORM)
                        .then((data2) => {
                            recentMatchDataOCHOA = data2.matches;

                            let recentMatchDataSCOTT;
                            API.MWcombatwz(process.env.SCOTT, process.env.SCOTT_PLATFORM)
                                .then((data2) => {
                                    recentMatchDataSCOTT = data2.matches;

                                    callback([recentMatchDataSOLNIT, recentMatchDataTIMMS, recentMatchDataOCHOA, recentMatchDataSCOTT]);

                                });
                        });
                });
        })
        .catch(err => console.log(err)); 



}


module.exports = { runWZStats, getWZRecentMatches };