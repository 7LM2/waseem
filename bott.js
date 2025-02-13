const { Client, Intents } = require('discord.js');
const fetch = require('node-fetch');
const config = require('./config.json'); // Store your bot token and Giphy API key here

const client = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
});

const OWNER_ID = 'YOUR_OWNER_DISCORD_ID'; // Replace with your Discord ID
const AVATAR_CHANNEL_ID = 'AVATAR_CHANNEL_ID'; // Replace with the channel ID for avatars
const BANNER_CHANNEL_ID = 'BANNER_CHANNEL_ID'; // Replace with the channel ID for banners
const GIPHY_API_KEY = config.giphyApiKey; // Your Giphy API key
const INTERVAL = 30 * 60 * 1000; // 30 minutes in milliseconds

// Fetch random GIF from Giphy
async function fetchGif(query) {
  const url = `https://api.giphy.com/v1/gifs/random?api_key=${GIPHY_API_KEY}&tag=${query}&rating=g`;
  const response = await fetch(url);
  const data = await response.json();
  return data.data.images.original.url;
}

// Send avatars and banners
async function sendMedia() {
  const avatarUrl = await fetchGif('mafia+gangs+cars+night+avatar');
  const bannerUrl = await fetchGif('mafia+gangs+cars+night+banner');

  const avatarChannel = client.channels.cache.get(AVATAR_CHANNEL_ID);
  const bannerChannel = client.channels.cache.get(BANNER_CHANNEL_ID);

  if (avatarChannel) avatarChannel.send(avatarUrl);
  if (bannerChannel) bannerChannel.send(bannerUrl);
}

// Special commands for the owner
client.on('messageCreate', async (message) => {
  if (message.author.id !== OWNER_ID) return;

  if (message.content === '!start') {
    setInterval(sendMedia, INTERVAL);
    message.reply('Bot started sending media every 30 minutes.');
  }

  if (message.content === '!stop') {
    clearInterval(interval);
    message.reply('Bot stopped sending media.');
  }

  if (message.content === '!ping') {
    message.reply('Pong!');
  }
});

// Start the bot
client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}`);
});

client.login(config.botToken);