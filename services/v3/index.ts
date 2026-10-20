// import fetch from "node-fetch";
import fetch from "node-fetch";
import "dotenv/config";
import { Client, HTTPError, Intents } from "discord.js";
import { Message } from "../../node_modules/discord.js/typings/index";
const client = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
});

client.once("ready", () => {
  client.user!.setPresence({ status: "idle" });
  console.log(`Client is ready: ${client.user!.tag}`);
});

async function query(data: any): Promise<string> {
  const response = await fetch(
    "https://api-inference.huggingface.co/models/bigscience/bloom",
    {
      headers: { Authorization: `Bearer ${process.env.API_TOKEN}` },
      method: "POST",
      body: JSON.stringify(data),
    }
  );
  const result = await response.json();
  console.log("Result:", result);
  if (result instanceof Array) {
    return result[0]["generated_text"];
  }
  return "";
}

const cleanString = (input: string): string => {
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

const generic: string[] = [
  "Umm..?",
  "Are you ok in the head?",
  "I have nothing to do and you're still somehow wasting my time",
  "Sorry I don't speak bullshit",
  "Ugh another human",
  "Keep the stupidity low, ideally as low as your IQ",
  "Did you drop your keyboard?",
];

client.on("messageCreate", async (message: Message) => {
  if (message.author.id === client.user?.id) return;
  if (message.guildId !== "433684465676714015") return;
  if (message.channelId !== "992342250602369045") return;
  console.log("");
  console.log(`Message: ${message.content}`);
  message.channel.sendTyping();
  const res = await query({
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
  message.reply(
    response.trim() === ""
      ? generic[Math.floor(Math.random() * generic.length)]
      : response
  );
});

console.log("Authenticating client...");
client.login(process.env.BOT_TOKEN).catch((e: HTTPError) => {
  console.log(e.name);
});
