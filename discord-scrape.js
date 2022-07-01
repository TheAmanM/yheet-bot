const puppeteer = require('puppeteer');
// const prompt = require('prompt-sync')({ sigint: true });
const { Client, Intents} = require('discord.js');
// const { debug } = require('request');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

const ownerId = "816886649333088271";
let debugMode = false;

page = null;

client.once('ready', () => {
    initialize();
    client.user.setPresence({ status: "online" });
    console.log(`Ready as ${client.user.tag}`);
});

client.on("disconnected", () => {
    client.user.setStatus("offline");
    console.log('Client disconnected')
});

const sendMessage = async (botMessage, userMessage) => {
    userMessage.channel.send(botMessage)
    console.log(`${client.user.tag}: ${botMessage}`);
}

client.on('messageCreate', message => {
    // const user = message.user.tag;
    if (message.author.id === ownerId && message.content[0] === '*') {
        const command = message.content.substring(1);
        if (command === 'debug' || command === 'd') {
            if (debugMode === true) {
                debugMode = false;
                message.channel.send('Maintainence mode has been **disabled**')
            } else {
                debugMode = true;
                message.channel.send('Maintainence mode has been **enabled**')
            }
            console.log(`Debug mode: ${debugMode}`);
        }
    } else {
        if (message.guildId === '967270379280294008') {
            if (message.channelId === '984166000167632946') {
                if (!message.author.bot) {
                    if (!debugMode) {
                        main(message);
                    }
                }
            }
        }
        return;
    }
});

const initialize = async () => {
    const browser = await puppeteer.launch({'args' : [
        '--no-sandbox',
        '--disable-setuid-sandbox'
      ]});
    page = await browser.newPage();
    await page.goto('https://www.pandorabots.com/pandora/talk?botid=b8d616e35e36e881');
    console.log('Client ready to send requests')

    // return page;
}


const post = async (message) => {
    // message = prompt('');
    await page.focus('tr > td > input');
    await page.keyboard.type(message.content);
    console.log(`${message.member.user.tag}: ${message.content}`)
    await page.keyboard.press("Enter");
    // return page;
}

const parseString = (returnVal) => {
    let currentString = returnVal.substring(returnVal.indexOf('<b>') + 3);
    currentString = currentString.substring(currentString.indexOf('<b>') + 3);
    currentString = currentString.substring(14);

    currentString = currentString.substring(0, currentString.indexOf('<br>'));
    currentString = currentString.trim();

    return currentString;
}

const getRequest = async (userMessage) => {
    userMessage.channel.sendTyping();
    await page.waitForSelector('b');
    const elementHandle = await page.$('body');
    const jsHandle = await elementHandle.getProperty('innerHTML');
    const val = parseString(await jsHandle.jsonValue());
    // console.log(val);
    sendMessage(val, userMessage);

    // return page;
}

const main = async (userMessage) => {
    // let page = await initialize();
    // while (true) {
    // console.log("Making POST Request... ")
    await post(userMessage);
    // console.log("Making GET Request... ")
    await getRequest(userMessage);
    // }
    // return page;
}

console.log('Establishing connection to Discord')
client.login(process.env.YHEETBOT_TOKEN);