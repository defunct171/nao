require('dotenv/config'),
{
  ACCOUNT_NAME,
  PASSWORD,
  SHARED_SECRET,
  GAMES_ID
} = process.env,
express = require('express'),
app = express(),
app.get('/', (req, res) => res.sendStatus(200)),
app.listen(process.env.PORT),
SteamUser = require('steam-user'),
SteamTotp = require('steam-totp'),
user = new SteamUser({ dataDirectory: null }),
user.logOn({
  accountName: ACCOUNT_NAME,
  password: PASSWORD,
  twoFactorCode: SteamTotp.getAuthCode(SHARED_SECRET),
}),
user.on('loggedOn', () => (
  user.setPersona(SteamUser.EPersonaState.Online),
  user.gamesPlayed(GAMES_ID.split(',').map((gameID) => +gameID)),
  console.log(user.steamID.toString())
)),
user.on('error', console.error)
