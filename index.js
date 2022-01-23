require('dotenv/config'),
{
  ACCOUNT_NAME,
  PASSWORD,
  AUTH_CODE,
  GAMES_ID
} = process.env,
express = require('express'),
app = express(),
app.get('/', (req, res) => res.sendStatus(200)),
app.listen(process.env.PORT),
SteamUser = require('steam-user'),
SteamTotp = require('steam-totp'),
playStateBlocked = false,
user = new SteamUser({ dataDirectory: null }),
{ promises: { writeFile } } = require('fs'),
sentry = require('./sentry.json'),
BJSON = require('buffer-json'),
sentryParsed = BJSON.parse(BJSON.stringify(sentry)),
(sentryParsed && user.setSentry(sentryParsed)),
user.logOn({
  accountName: ACCOUNT_NAME,
  password: PASSWORD,
}),
user.on('loggedOn', () => (
  user.setPersona(SteamUser.EPersonaState.Snooze),
  user.gamesPlayed(GAMES_ID.split(',').map((gameID) => +gameID)),
  console.log(user.steamID.toString())
)),
user.on('playingState', (blocked) =>
  playStateBlocked !== blocked && (playStateBlocked = blocked)
),
user.on('sentry', async (sentry) =>
  await writeFile('./sentry.json', BJSON.stringify(sentry))
),
user.on('error', (err) => (
  (err.eresult === SteamUser.EResult.LoggedInElsewhere &&
  (playStateBlocked = true, setTimeout(() => user.logOn(true), 60 * 5 * 1e3))),
  console.error(err.message)
))
