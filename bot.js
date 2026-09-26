require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { App, LogLevel } = require('@slack/bolt');

// Socket Mode is used when an app level token is provided (no public URL needed).
// Otherwise the bot listens over HTTP for Events API requests at /slack/events.
const useSocketMode = Boolean(process.env.SLACK_APP_TOKEN);

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  socketMode: useSocketMode,
  appToken: process.env.SLACK_APP_TOKEN,
  logLevel: LogLevel.INFO,
});

const LOG_FILE = path.join(__dirname, 'messages.log');

function logMessage(message) {
  const entry = {
    time: new Date().toISOString(),
    channel: message.channel,
    user: message.user,
    text: message.text,
    ts: message.ts,
  };
  console.log(`[message] #${entry.channel} <${entry.user}>: ${entry.text}`);
  fs.appendFile(LOG_FILE, JSON.stringify(entry) + '\n', (err) => {
    if (err) console.error('Failed to write log:', err);
  });
}

// Log every message the bot receives through the Events API.
// Registered first and calls next() so the other listeners still run.
app.message(async ({ message, next }) => {
  // Ignore bot messages and edits/deletes (they have a subtype).
  if (!message.subtype && !message.bot_id) logMessage(message);
  await next();
});

// Respond to messages containing "hello" / "hi" / "hey".
app.message(/\b(hello|hi|hey)\b/i, async ({ message, say }) => {
  if (message.subtype || message.bot_id) return;
  await say({
    text: `Hey there <@${message.user}>! :wave:`,
    thread_ts: message.thread_ts,
  });
});

// Respond to "help".
app.message(/^help$/i, async ({ message, say }) => {
  if (message.subtype || message.bot_id) return;
  await say(
    'Here is what I can do:\n' +
      '• Say *hello* and I will greet you\n' +
      '• Use */hello* for a greeting from a slash command\n' +
      '• I log every message in channels I am a member of'
  );
});

// Slash command: /hello [name]
app.command('/hello', async ({ command, ack, respond }) => {
  await ack();
  const name = command.text.trim();
  await respond({
    response_type: 'in_channel',
    text: name
      ? `Hello, ${name}! :wave: (sent by <@${command.user_id}>)`
      : `Hello, <@${command.user_id}>! :wave:`,
  });
});

app.error(async (error) => {
  console.error('Unhandled Bolt error:', error);
});

(async () => {
  const port = Number(process.env.PORT) || 3000;
  await app.start(port);
  console.log(
    useSocketMode
      ? '⚡️ Slack bot is running in Socket Mode'
      : `⚡️ Slack bot is listening on port ${port} (POST /slack/events)`
  );
})();
