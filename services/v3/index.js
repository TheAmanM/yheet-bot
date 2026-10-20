var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// import fetch from "node-fetch";
import fetch from "node-fetch";
import "dotenv/config";
import { Client, Intents } from "discord.js";
const client = new Client({
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
});
client.once("ready", () => {
    client.user.setPresence({ status: "idle" });
    console.log(`Client is ready: ${client.user.tag}`);
});
function query(data) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield fetch("https://api-inference.huggingface.co/models/bigscience/bloom", {
            headers: { Authorization: `Bearer ${process.env.API_TOKEN}` },
            method: "POST",
            body: JSON.stringify(data),
        });
        const result = yield response.json();
        console.log("Result:", result);
        if (result instanceof Array) {
            return result[0]["generated_text"];
        }
        return "";
    });
}
const cleanString = (input) => {
    let options = input.split("\n");
    options.shift();
    // options.shift();
    options.filter((option) => option.indexOf("Human:") !== 0);
    // let option = options[Math.floor(Math.random() * options.length)];
    let option = options[0];
    option = option.indexOf("Chatbot:") === 0 ? option.substring(8) : option;
    option.trim();
    option.replace("  ", " ");
    return option;
};
const generic = [
    "Umm..?",
    "Are you ok in the head?",
    "I have nothing to do and you're still somehow wasting my time",
    "Sorry I don't speak bullshit",
    "Ugh another human",
    "Keep the stupidity low, ideally as low as your IQ",
    "Did you drop your keyboard?",
];
client.on("messageCreate", (message) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    if (message.author.id === ((_a = client.user) === null || _a === void 0 ? void 0 : _a.id))
        return;
    if (message.guildId !== "433684465676714015")
        return;
    if (message.channelId !== "992342250602369045")
        return;
    console.log("");
    console.log(`Message: ${message.content}`);
    message.channel.sendTyping();
    const res = yield query({
        inputs: `Human: ${message.content.trim()}\nChatbot: `,
    });
    console.log("");
    console.log(res);
    /* let items: any = res.split("\n");
    items.shift();
    items = items
      .reduce(function (a: any, b: any) {
        return a.length > b.length ? a : b;
      })
      .substring(4)
      .trim();
    items = items.split(".");
    items.pop();
    items = items.join(".");
    message.reply(items); */
    const response = cleanString(res);
    message.reply(response.trim() === ""
        ? generic[Math.floor(Math.random() * generic.length)]
        : response);
}));
console.log("Authenticating client...");
client.login(process.env.BOT_TOKEN).catch((e) => {
    console.log(e.name);
});
