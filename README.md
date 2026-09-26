# Slack Bot (Bolt for JavaScript)

A Slack bot that:
- **Responds to messages** — say `hello`, `hi` or `hey` in a channel and it greets you; `help` lists commands.
- **Handles the `/hello` slash command** — `/hello`, `/hello Moussa` or `/hello Awa`.
- **Logs messages** received through the Events API to the console and to `messages.log` (JSON lines).

## Step 1 — Set up the Slack app

1. Go to https://api.slack.com/apps → **Create New App** → **From scratch**, pick a name and workspace.
2. **OAuth & Permissions** → *Bot Token Scopes*, add:
   - `chat:write` — send messages
   - `channels:history` — read messages in public channels
   - `commands` — slash commands
3. **Slash Commands** → **Create New Command**: command `/hello`, short description "Say hello".
   (Request URL: see step 5; in Socket Mode it is not needed.)
4. **Event Subscriptions** → turn on **Enable Events** → *Subscribe to bot events* → add `message.channels`.
5. Choose how Slack reaches your bot:
   - **Socket Mode (easiest, local dev):** *Socket Mode* → enable it, create an App-Level Token with the
     `connections:write` scope and put it in `SLACK_APP_TOKEN`.
   - **HTTP (Events API over a public URL):** run the bot, expose it (e.g. `ngrok http 3000`) and set
     `https://<your-url>/slack/events` as the Event Subscriptions Request URL and the `/hello` Request URL.
6. **Install App** → *Install to Workspace*, then copy the **Bot User OAuth Token** (`xoxb-…`).
   Copy the **Signing Secret** from *Basic Information*.
7. In Slack, invite the bot to a channel: `/invite @YourBotName`.

> After changing scopes or events, reinstall the app so they take effect.

## Step 2 — Run the bot

```bash
npm install
cp .env.example .env   # then fill in the tokens
npm start
```

## Try it

| In Slack             | Bot does                                |
|----------------------|-----------------------------------------|
| `hello`              | Replies "Hey there @you! 👋"            |
| `help`               | Lists what it can do                    |
| `/hello`             | Posts "Hello, @you! 👋"                 |
| `/hello Moussa`      | Posts "Hello, Moussa! 👋"               |
| `/hello Fatou Diop`  | Posts "Hello, Fatou Diop! 👋"           |
| any message          | Logged to the console and `messages.log`|
