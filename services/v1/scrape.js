const puppeteer = require('puppeteer');
const prompt = require('prompt-sync')({ sigint: true });

const initialize = async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('https://www.pandorabots.com/pandora/talk?botid=b8d616e35e36e881');

    return page;
}

const post = async (message, page) => {
    message = prompt('');
    await page.focus('tr > td > input');
    await page.keyboard.type(message);
    await page.keyboard.press("Enter");
    return page;
}

const parseString = (returnVal) => {
    let currentString = returnVal.substring(returnVal.indexOf('<b>') + 3);
    currentString = currentString.substring(currentString.indexOf('<b>') + 3);
    currentString = currentString.substring(14);

    currentString = currentString.substring(0, currentString.indexOf('<br>'));
    currentString = currentString.trim();

    return currentString;
}

const getRequest = async (page) => {
    await page.waitForSelector('b');
    const elementHandle = await page.$('body');
    const jsHandle = await elementHandle.getProperty('innerHTML');
    const val = parseString(await jsHandle.jsonValue());
    console.log(val);

    return page;
}

const main = async () => {
    let page = await initialize();
    while (true) {
        // console.log("Making POST Request... ")
        page = await post('hello', page);
        // console.log("Making GET Request... ")
        page = await getRequest(page);
    }
}

main();