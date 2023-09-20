import dotenv from "dotenv";
import { Client, GatewayIntentBits } from "discord.js";

dotenv.config();

const { API_KEY, TOKEN } = process.env;

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});
client.once("ready", () => console.log(`Logged in as ${client.user.tag}!`));

client.on("messageCreate", async (message) => {
  if (message.author.bot || message.channel.name !== "ai-questions") return;
  try {
    const res = await fetch("https://api.openai.com/v1/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: "text-davinci-003",
        prompt: message.content,
        max_tokens: 200,
      }),
    });

    const data = await res.json();
    const responseText = data.choices[0].text;
    await message.reply(responseText);
  } catch (error) {
    console.error(error);
    await message.reply('There was an error, try again later.');
  }
});

client.login(TOKEN);
