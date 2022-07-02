const puppeteer = require('puppeteer');
const { Client, Intents } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

// import statusList from './status.json';
const statusList = require('./status.json');

const ownerId = "816886649333088271";
let debugMode = false;

page = null;

client.once('ready', () => {
    initialize();
    client.user.setPresence({ status: "online" });
    console.log(`Ready as ${client.user.tag}`);
    runStatus();
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
        // if (message.guildId === '967270379280294008') {
        if (message.guildId === '433684465676714015') {
            // if (message.channelId === '984166000167632946') {
            if (message.channelId === '992342250602369045') {
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

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const runStatus = async () => {
    const numMinutes = 60 * 24;
    while (true) {
        const index = Math.round(Date.now() / (1000 * 60 * numMinutes)) % statusList.length;
        activityName = statusList[index]
        // console.log(Date.now());
        console.log(`Setting status to: ${index}) ${activityName}`);

        client.user.setActivity(
            {
                name: activityName,
                // type: 0,
            }
        );
        await sleep(1000 * 60 * numMinutes);
        /* await new Promise(
            resolve, () => (
                setTimeout(
                    () => {
                        client.user.setPresence(
                            {
                                activities: {
                                    name: activityName
                                }
                            }
                        );
                    }, 1000 * 60 * 5
                )
            )
        ); */
    }

}

const initialize = async () => {
    const browser = await puppeteer.launch({
        'args': [
            '--no-sandbox',
            '--disable-setuid-sandbox'
        ]
    });
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