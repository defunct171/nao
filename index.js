require('dotenv/config'),
{
  ACCOUNT_NAME,
  PASSWORD,
  GAMES_ID
} = process.env,
express = require('express'),
app = express(),
app.get('/', (req, res) => res.statusCode(200)),
app.listen(process.env.PORT),
database = new (require('@replit/database'))(),
SteamUser = require('steam-user'),
user = new SteamUser({ dataDirectory: null }),
(async () => (
  loginKey = await database.get('key'),
  user.logOn({
    accountName: ACCOUNT_NAME,
    password: PASSWORD,
    loginKey,
    rememberPassword: true
  })
))(),
user.on('loginKey', (key) =>
  database.set('key', key)
    .then(() => console.log(`Got key "${key}"`))
),
user.on('loggedOn', () => (
  user.setPersona(SteamUser.EPersonaState.Offline),
  user.gamesPlayed(GAMES_ID.split(',').map((gameID) => +gameID)),
  console.log(user.steamID.toString())
)),
user.on('error', console.error)
