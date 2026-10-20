const { Client, Intents, Message } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });
// import fetch from 'node-fetch';
const axios = require('axios');
// import('node-fetch');
// const fetch = import("node-fetch");
// require('cross-fetch/polyfill');

const clientToken = "REDACTED";
const ownerId = "816886649333088271";
let maintainenceMode = true;

client.once('ready', () => {
    // client.user.setStatus("dnd");
    client.user.setPresence({ status: "online" });
    console.log('Ready!');
})

client.on("disconnected", () => {
    client.user.setStatus("offline");
    // console.log(client.user); //returns the current user
});

const restart = (message) => {
    // client.destroy().then(() => {
    //     client.login(clientToken);
    // });

    // client.destroy().then(client.login(clientToken));

    // client.user.setPresence({status: "idle"});

    try {
        message.channel.send("<a:Loading:575715719103381506> Attempting a restart...").then(msg => {
            //msg.react('🆗');
            // client.user.setStatus('offline');
            client.user.setPresence({ status: "offline" });
            setTimeout(function () {
                msg.edit("<:CheckMark:550460857625346066> I should be back up now!");
                client.user.setPresence({ status: "online" });
            }, 10000);
        })
            .then(client.destroy())
            .then(client.login(clientToken))
    } catch (e) {

        message.channel.send(`Error: ${e}`);
    }
}

/* client.on('message', message => {
    if (message.author.bot) return;

    if (message.content === 'yheet') {
        message.channel.send('boi');
    // } else if (message.content.split(' ')[0] === 'say' && message.author.id === '816886649333088271') {
    } else if (message.content.split(' ')[0] === 'say') {
        message.delete();
        msg = message.content;
        val1 = msg.split(' ');
        val1.shift();
        message.channel.send(val1.join(' '));
    }
}) */

client.on('message', message => {
    if (message.author.bot || !message.content.startsWith('*')) return;

    msg = message.content.substring(1);
    splitMsg = msg.split(' ');
    command = splitMsg[0];
    // console.log(`splitMsg: ${splitMsg}`);
    args = splitMsg.shift();
    // console.log(`splitMsg: ${splitMsg}`);

    if (!maintainenceMode || message.author.id == ownerId) {
        if (command === 'help') {
            commandsList = {
                "crypto [NUM]": "Prints the top [NUM] cryptocurrencies by market cap, in a nicely formatted table. The default is 15 currencies. "
            };
            let commandsString = "```Commands:\n"
            for (key in commandsList) {
                commandsString += `\n-${key}: ${commandsList[key]}`;
            }
            commandsString += "```";
            message.channel.send(commandsString);
        } else if (command === 'crypto') {
            handleCrypto(splitMsg, message).then(() => {
                return;
            });
            // handleCrypto(splitMsg, message);
            // if(message.author.id == 816886649333088271) {
            // } else {
            //     message.channel.send("Never gonna give you up, never gonna let you down 😉");
            //     return;
            // }
        } else if (command === 'restart') {
            if (message.author.id !== ownerId) return;
            restart(message);
        } else if (command === 'say') {
            if (message.author.id !== ownerId) return;
            handleSay(splitMsg, message);
        } else if (command === "status") {
            console.log("Status change detected");
            if (message.author.id !== ownerId) return;
            handleStatus(splitMsg, message);
        } else if (command === "debug" || command === "d") {
            if (message.author.id !== ownerId) return;
            handleDebugMode(splitMsg, message);
        } else if (command === "ping") {
            message.channel.send("Pong!");
        }
        else {
            message.channel.send("Sorry, this command currently isn't a feature! 🤷‍♂️")
        }
    }
});

const handleCrypto = async (args, message) => {
    let res = null;
    console.log(`Arguments: ${args}`);
    try {
        someValue = parseInt(args[0]);
    } catch (error) {
        message.channel.send("Sorry, invalid argument. Please try ```-crypto```. ")
        return;
    }

    if (args.length !== 0) {
        firstArg = args[0];
    } else {
        firstArg = 15;
    }
    // if(args.length === 0) {
    //     res = await fetchCryptoData(false, message);
    // } else {
    //     res = await fetchCryptoData(true, message);
    // }
    if (firstArg < 1 || firstArg > 30) {
        message.channel.send("Sorry, invalid argument. Please enter a number from 1 - 30. ");
        return;
    }
    console.log(`First Argument is ${firstArg}`);
    res = await fetchCryptoData(firstArg);
    // res = res.toString().replaceAll(",", "\n");
    res = res.join('\n');
    message.channel.send("```" + res + "```");
}

const fetchCryptoData = async (firstArg) => {
    let url = 'https://api.coincap.io/v2/assets?limit=';
    url = url + firstArg;
    // const response = await fetch(url);
    let data = {};
    // console.log(url);
    let response = await axios.get(url)
    // data = response.json();
    // console.log(response.data);
    data = response.data;
    // console.log("Parsed!");
    values = data["data"];

    let gap = "                     ";

    // const property = getPrice ? "priceUsd" : "name";
    let returnArray = [`Index | Currency             |   Price
    `];

    for (let i = 0; i < values.length; i++) {
        index = `${i + 1}    | `;
        // index.length == 7 ? " " + index : index;
        if (index.length == 7) {
            index = "0" + index;
        }
        currency = values[i];
        // value = currency[property];
        currencyName = currency["name"];
        currencyPrice = formatter.format(currency["priceUsd"]);
        // console.log(`${currencyName}: ${currencyPrice}`);
        currentGap = gap.substring(currencyName.length);
        // if(property === 'name') {
        //     returnArray.push(value + currentGap + "|");
        // } else {
        //     returnArray.push(value.toLocaleString('en-US', { style: 'currency', currency: 'USD' }));
        // }
        returnArray.push(index + currencyName + currentGap + "|" + "   " + currencyPrice);
    }

    // console.log("Appended!")
    return returnArray;


    // console.log(values[0]);
    /* if(getPrice === false) {
        console.log(`Adding ${values.length} names`)
        const names = [];
        for (currency in values) {
            print(currency["name"]);
            names.push(currency["name"]);
        }
        console.log(names);
        return names;
    } else {
        const prices = [];
        for (currency in values) {
            prices.push(currency["priceUsd"]);
        }
        console.log(prices);
        return prices;
    } */
}

var formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',

    // These options are needed to round to whole numbers if that's what you want.
    //minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
    //maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
});

const handleSay = async (args, message) => {
    if (args.kength === 0) {
        return;
    }

    await message.delete();
    await message.channel.send(`${args.join(' ')}`);
}

const handleStatus = async (args, message) => {

    if (args.length === 0) {
        message.channel.send("Sorry, invalid number of arguments");
        return;
    }

    try {
        statusTypes = {
            "dnd": "Do not Disturb",
            "online": "Online",
            "offline": "Offline",
            "idle": "Idle"
        };
        responseMsg = statusTypes[args[0]] ?? int.parse("A");
        await message.channel.send(`Changing status to **${responseMsg}**..`);
        client.user.setPresence({ status: args[0].toString() });
        // client.user.setPresence({status: "idle"});
        // setTimeout(
        //     function() {

        //         message.channel.send(`Status successfully changed to **${args[0]}**!`);
        //     }, 5000,
        // );
    } catch (e) {
        message.channel.send("Sorry, an invalid argument was passed. ");
        return;
    }
}

const handleDebugMode = async (args, message) => {

    /* if (args.length === 0) {
        message.channel.send("Sorry, invalid number of arguments");
        return;
    }

    try {
        statusTypes = {
            "dnd": "Do not Disturb",
            "online": "Online",
            "offline": "Offline",
            "idle": "Idle"
        };
        responseMsg = statusTypes[args[0]] ?? int.parse("A");
        await message.channel.send(`Changing status to **${responseMsg}**..`);
        client.user.setPresence({ status: args[0].toString() });
        maintainenceMode = true;
        // client.user.setPresence({status: "idle"});
        // setTimeout(
        //     function() {

        //         message.channel.send(`Status successfully changed to **${args[0]}**!`);
        //     }, 5000,
        // );
    } catch (e) {
        message.channel.send("Sorry, an invalid argument was passed. ");
        return;
    } */
    
    const debugModeMessage = (currentState) => {
        message.channel.send(`Maintainence mode has been ${currentState ? '**enabled**' : '**disabled**'}`);
    }
    
    try {

        if(args.length === 1 & args[0] === 'show') {
            message.channel.send(`Maintainence mode is currently set to: ${maintainenceMode ? '**enabled**' : '**disabled**'}`);
            return;
        }

        if (args.length === 0) {
            maintainenceMode = !maintainenceMode;
            debugModeMessage(maintainenceMode);
        } else {
            maintainenceMode = args[0] === 'on' ? true : args[0] === 'off' ? false : int.parse("A")
            debugModeMessage(maintainenceMode);
        }
    } catch (e) {
        message.channel.send(`Sorry, an invalid argument was passed. (${e.toString()})`);
    }
    return;
}

client.login(clientToken);