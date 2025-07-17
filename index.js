const express = require("express");
const bodyParser = require("body-parser");
const { Client, GatewayIntentBits } = require("discord.js");

const app = express();
app.use(bodyParser.json());

const DISCORD_BOT_TOKEN = process.env.DISCORD_BOT_TOKEN;
const TARGET_CHANNEL_ID = process.env.TARGET_CHANNEL_ID;

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once("ready", () => {
  console.log(`Bot ready as ${client.user.tag}`);
});

app.post("/update-ccu", async (req, res) => {
  const { ccu } = req.body;
  if (typeof ccu !== "number") return res.status(400).send("Invalid CCU");
  try {
    const channel = await client.channels.fetch(TARGET_CHANNEL_ID);
    if (channel?.setName) {
      await channel.setName(`Players: ${ccu}`);
      return res.send("OK");
    }
    return res.status(404).send("Channel not found");
  } catch (e) {
    console.error(e);
    return res.status(500).send("Error");
  }
});

app.get("/", (req, res) => res.send("✅ Server is running"));
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Listening on ${PORT}`));

client.login(DISCORD_BOT_TOKEN);
