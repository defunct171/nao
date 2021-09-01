require('dotenv/config'),
{
  ACCOUNT_NAME,
  PASSWORD,
  GAMES_IDS
} = process.env,
express = require('express'),
app = express(),
app.get('/', (req, res) => res.statusCode(200)),
app.listen(process.env.PORT),
{
  readFileSync,
  promises: { writeFile }
} = require('fs'),
loginKey = readFileSync('key', 'utf8'),
{ resolve } = require('path'),
SteamUser = require('steam-user'),
user = new SteamUser({ dataDirectory: null }),
user.logOn({
  accountName: ACCOUNT_NAME,
  password: PASSWORD,
  loginKey,
  rememberPassword: true
}),
user.on('loginKey', (key) =>
  writeFile('key', key, 'utf8')
    .then(() => print(`Got key "${key}"`))
),
user.on('loggedOn', () => (
  user.setPersona(SteamUser.EPersonaState.Online),
  user.gamesPlayed(GAMES_IDS.split(',').map((gameID) => +gameID)),
  console.log(user.steamID.toString())
)),
user.on('error', console.error)
