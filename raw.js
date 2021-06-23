

const giveMeMyHtml = (data) => {

    return (`
    <!DOCTYPE html>
    <html lang="en">

    <head>
        <style type="text/css">
            /*
                * Reference - https://codepen.io/supah/pen/WwrJpw
                */
            *,
            *:before,
            *:after {
                box-sizing: border-box;
            }

            html,

            body {
                font: 16px/1.2 "Roboto", sans-serif;
                color: #333;
            }

            a {
                display: inline-block;
                color: #333;
                text-decoration: none;
            }

            .blog {
                font-size: 14px;
                font-weight: bold;
                text-align: center;
                position: absolute;
                bottom: 15px;
                left: 50%;
                transform: translateX(-50%);
                z-index: 1;
            }

            .container {
                width: 500px;
                height: auto;
                border-radius: 10px;
                background-color: white;
                box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                z-index: 1;
                overflow: hidden;
            }

            .leaderboard {
                background: linear-gradient(to bottom, #3a404d, #181c26);
            }

            .leaderboard .head {
                padding: 20px 16px;
                color: snow;
                font-size: 20px;
                text-align: center;
            }

            .leaderboard .head h1 {
                display: inline-block;
                margin-left: 4px;
            }

            .leaderboard .body {
                color: snow;
                font-size: 16px;
            }

            .leaderboard ol {
                counter-reset: number;
                /* 定義和初始化計數器 */
            }

            .leaderboard li {
                padding: 16px;
                display: flex;
            }

            .leaderboard li mark {
                flex-grow: 1;
                color: snow;
                background-color: transparent;
            }

            .leaderboard li:before {
                counter-increment: number;
                /* 遞增計數器 */
                content: counter(number) ".";
                /* 顯示計數器 */
                margin-right: 4px;
            }

            .leaderboard li:nth-child(1) {
                background: #fa6855;
            }

            .leaderboard li:nth-child(2) {
                background: #e0574f;
            }

            .leaderboard li:nth-child(3) {
                background: #d7514d;
            }

            .leaderboard li:nth-child(4) {
                background: #cd4b4b;
            }

            .leaderboard li:nth-child(5) {
                background: #c24448;
            }
        </style>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Warzone Leaderboard</title>
    </head>

    <body>
        <div class="container">
            <div class="leaderboard">
                <div class="head">
                    <i class="fas fa-crown"></i>
                    <h1>Warzone Kill Leaderboard</h1>
                </div>
                <div class="body" style="padding-bottom: 15px;">
                    <ol style="width: 450px;">
                        <li>
                            <mark>${data[1].name}</mark>
                            <small>${data[1].kills} Kills</small>
                        </li>
                        <li>
                            <mark>${data[2].name}</mark>
                            <small>${data[2].kills} Kills</small>
                        </li>
                        <li>
                            <mark>${data[3].name}</mark>
                            <small>${data[3].kills} Kills</small>
                        </li>
                        <li>
                            <mark>${data[4].name}</mark>
                            <small>${data[4].kills} Kills</small>
                        </li>
                        <li>
                            <mark>${data[5].name}</mark>
                            <small>${data[5].kills} Kills</small>
                        </li>
                    </ol>
                </div>
            </div>
        </div>
    </body>

    </html>`)

}




module.exports = { giveMeMyHtml };