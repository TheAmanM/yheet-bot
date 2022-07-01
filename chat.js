const { Client, Intents, Message } = require('discord.js');
const axios = require('axios');
const https = require('https');
// import axios from 'axios';
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

const url = 'https://www.pandorabots.com/pandora/talk?botid=a847934aae3456cb';

const clientToken = "REDACTED";
const ownerId = "816886649333088271";
let maintainenceMode = true;

/* client.once('ready', () => {
    client.user.setPresence({ status: "online" });
    console.log('Ready!');
})

client.on("disconnected", () => {
    client.user.setStatus("offline");
    console.log('Client disconnected');
}); */

const sendMessage = async (message) => {
    /* await axios.post('https://www.pandorabots.com/pandora/talk?botid=a847934aae3456cb', {
        // botid: 'a847934aae3456cb',
        botcust2: 'b5e332005f80644c',
        message: message,
        // message: `${encodeURIComponent(message)}`
    }).then((postResponse) => {
        console.log(`postResponse: ${postResponse.data}`);
    }); */


    /* let data = {
        botid: 'a847934aae3456cb',
        botcust2: 'b5e332005f80644c',
        message: message
    };

    fetch.fetch("https://www.pandorabots.com/pandora/talk", {
        method: "POST",
        headers: { 'Content-Type': 'text/html; charset=utf-8' },
        body: JSON.stringify(data)
    }).then(res => {
        console.log("Request complete! response:", res);
    }); */


    const options = {
        hostname: 'https://www.pandorabots.com/pandora/',
        // port: 443,
        path: 'talk',
        method: 'POST',
        /* headers: {
:authority: 'www.pandorabots.com',
:method: 'POST',
:path: '/pandora/talk?botid=a847934aae3456cb',
:scheme: 'https',
accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*;q=0.8,application/signed-exchange;v=b3;q=0.9',
accept-encoding: 'gzip, deflate, br',
accept-language: 'en-US,en;q=0.9',
cache-control: 'no-cache',
content-length: '11',
content-type: 'application/x-www-form-urlencoded',
cookie: 'botcust2=b5e332005f80644c; _ga=GA1.2.1063995546.1656588727; _gid=GA1.2.1500796106.1656588727',
origin: 'https://www.pandorabots.com',
pragma: 'no-cache',
referer: 'https://www.pandorabots.com/pandora/talk?botid=a847934aae3456cb',
sec-ch-ua: '".Not/A)Brand";v="99", "Google Chrome";v="103", "Chromium";v="103"',
sec-ch-ua-mobile: '?0',
sec-ch-ua-platform: '"Windows"',
sec-fetch-dest: 'document',
sec-fetch-mode: 'navigate',
sec-fetch-site: 'same-origin',
sec-fetch-user: '?1',
upgrade-insecure-requests: '1',
user-agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Safari/537.36',
        }, */
    };

    let data = JSON.stringify({
        botid: 'a847934aae3456cb',
        botcust2: 'b5e332005f80644c',
        message: message
    });

    const req = https.request(options, res => {
        console.log(`statusCode: ${res.statusCode}`);

        res.on('data', d => {
            process.stdout.write(d);
        });
    });

    req.on('error', error => {
        console.error(error);
    });

    req.write(data);
    req.end();
}

const getLastMessage = async () => {
    let parsedResponse = '';
    // console.log(message);
    /* let response = await axios.get('https://www.pandorabots.com/pandora/talk', {
        params: {
            // url: 'https://www.pandorabots.com/pandora/talk',
            // method: 'get',
            // params: {
                botid: 'a847934aae3456cb',
                message: message,
                botcust2: 'b5e332005f80644c',
            // }
        }
    }); */
    /* await axios.post(`https://www.pandorabots.com/pandora/talk?botid=a847934aae3456cb`, validateStatus=() => true, {
        // &botcust2=b5e332005f80644c&message=${encodeURIComponent(message)}
            // botid: 'a847934aae3456cb',
            message: encodeURIComponent(message),
            botcust2: 'b5e332005f80644c',
            // validateStatus: () => true,
    }).then((response) => {console.log(`POST Status Code: ${response.statusCode}`)}); */

    /* await axios.post('https://www.pandorabots.com/pandora/talk?botid=a847934aae3456cb', {
        // botid: 'a847934aae3456cb',
        botcust2: 'b5e332005f80644c',
        message: message,
        // message: `${encodeURIComponent(message)}`
    }).then((postResponse) => {
        console.log(`postResponse: ${postResponse.data}`);
    }); */
    await axios.get('https://www.pandorabots.com/pandora/talk?botid=a847934aae3456cb&botcust2=b5e332005f80644c').then((getResponse) => {
        // console.log(getResponse.data);
        parsedResponse = parseResponse(getResponse.data);
        // console.log(`trimmed: ${parsedResponse}`);
    });
    return parsedResponse;
}

/* const beginSession = async () => {
    const response = await axios.get('https://www.pandorabots.com/pandora/talk?botid=a847934aae3456cb&botcust2=b5e332005f80644c', {
        params: {
            ID: 12345,
            message: `${message}`
        }
    });
    console.log(parseResponse(response.data));
} */

const parseResponse = (data) => {
    // console.log(data);
    const startIndex = data.indexOf('<font size="2" face="Verdana" color=darkred>');
    const s1 = data.substring(startIndex + '<font size="2" face="Verdana" color=darkred>'.length);
    // console.log(s1);
    const index = s1.indexOf('</font>');
    // console.log(index);
    const s2 = s1.substring(0, index);
    // console.log(s2);

    // console.log(s2.trim());
    return s2;
}

/* const parseResponse = (data) => {
    // console.log(data);
    const startIndex = data.indexOf('<b>A.L.I.C.E:</b>');
    const s1 = data.substring(startIndex + '<b>A.L.I.C.E:</b>'.length);
    console.log(s1);
    const index = s1.indexOf('<br>');
    // console.log(index);
    const s2 = s1.substring(0, index - 1);
    console.log(s2);

    return s2.trim();
} */

/* getLastMessage().then((message) => {
    console.log(message);
}); */
sendMessage('hey').then((res) => {
    console.log(res);
})