const { Client, Intents } = require("discord.js");
const GoogleAssistant = require("google-assistant");
const path = require("path");

const client = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
});

const config = {
  auth: {
    keyFilePath: path.resolve(__dirname, "secret.json"),
    // where you want the tokens to be saved
    // will create the directory if not already there
    // savedTokensPath: path.resolve(__dirname, "tokens.json"),
    // you can also pass an oauth2 client instead if you've handled
    // auth in a different workflow. This trumps the other params.
    // oauth2Client: YOUR_CLIENT,
  },
  // this param is optional, but all options will be shown
  conversation: {
    /* audio: {
      encodingIn: "LINEAR16", // supported are LINEAR16 / FLAC (defaults to LINEAR16)
      sampleRateIn: 16000, // supported rates are between 16000-24000 (defaults to 16000)
      encodingOut: "LINEAR16", // supported are LINEAR16 / MP3 / OPUS_IN_OGG (defaults to LINEAR16)
      sampleRateOut: 24000, // supported are 16000 / 24000 (defaults to 24000)
    }, */
    lang: "en-US", // language code for input/output (defaults to en-US)
    deviceModelId: "xxxxxxxx", // use if you've gone through the Device Registration process
    deviceId: "xxxxxx", // use if you've gone through the Device Registration process
    // deviceLocation: {
    //   coordinates: {
    //     // set the latitude and longitude of the device
    //     latitude: xxxxxx,
    //     longitude: xxxxx,
    //   },
    // },
    textQuery: "What time is it?", // if this is set, audio input is ignored
    isNew: true, // set this to true if you want to force a new conversation and ignore the old state
    /* screen: {
      isOn: true, // set this to true if you want to output results to a screen
    }, */
  },
};

const assistant = new GoogleAssistant(config.auth);

const startConversation = (conversation) => {
  conversation
    .on("response", (text) => {
      console.log(`YheetBot: ${text}`);
    })
    .on("error", (error) => {
      console.log(`Error: ${error}`);
    });
};

const ownerId = "816886649333088271";
const version = "2.0.0";
const botPrefix = "*";

let debugMode = false;

client.on("ready", () => {
  client.user.setPresence({ status: "online" });
  console.log(`Client ready: ${client.user.tag}`);
  console.log(`Bot version: ${version}`);
  assistant
    .on("ready", () => assistant.start(config.conversation))
    .on("started", startConversation);
  console.log("");
});

client.on("disconnected", () => {
  client.user.setStatus("invisible");
  console.log("Client disconnected.");
});

const sendMessage = async (message, channel) => {
  channel.send(message);
};

const completeOperation = async (messageObject) => {
  messageObject.react("👍");
};

const handleMessage = async (message, channel) => {
  console.log(`Message: ${message}`);
};

client.on("messageCreate", (message) => {
  if (message.content[0] === botPrefix) {
    const trimmed = message.content.trim().substring(1);
    let args = trimmed.split(" ");
    const command = args.shift();

    if (command === "debug" || command === "d") {
      if (args[0] === "show") {
        console.log(`Debug mode: ${debugMode}`);
        completeOperation(message);
        return;
      } else if (args[0] === "set") {
        if (args[1] === "true") {
          debugMode = true;
          completeOperation(message);
          return;
        } else if (args[1] === "false") {
          debugMode = false;
          completeOperation(message);
          return;
        } else {
          console.error("Invalid argument!");
        }
      } else {
        console.error("Invalid operation!");
      }
    } else if (command === "version" || command === "v") {
      sendMessage(`Bot version: ${version}`, message.channel);
    } else {
      console.log("Invalid command!");
    }
  } else {
    if (
      message.guildId === "967270379280294008" &&
      message.channelId === "984166000167632946"
    ) {
      handleMessage(message.content, message.channel);
    }
  }
});

console.log("Establishing connection...");
client.login("REDACTED");
