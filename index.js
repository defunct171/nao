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
playStateBlocked = false,
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
user.on('playingState', (blocked) =>
  playStateBlocked !== blocked && (playStateBlocked = blocked)
)
user.on('error', (err) => (
  (err.eresult === SteamUser.EResult.LoggedInElsewhere &&
  (playStateBlocked = true, setTimeout(() => user.logOn(true), 60 * 5 * 1e3))),
  console.error(err.message)
))
