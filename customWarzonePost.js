//  htmlToPng.js
const { MessageAttachment } = require('discord.js');
const nodeHtmlToImage = require('node-html-to-image');

const RAWhtml = require('./raw').giveMeMyHtml;

module.exports = async (matchData) => {

    const _htmlTemplate = RAWhtml(matchData);

    const images = await nodeHtmlToImage({
        html: _htmlTemplate,
        quality: 100,
        type: 'jpeg',
        puppeteerArgs: {
            args: ['--no-sandbox'],
        },
        encoding: 'buffer',
    })

    return images;

};