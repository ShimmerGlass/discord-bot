var knownGames = ['lol', 'osu'];

module.exports = function(args, done) {
	var gameName = args.args[0];
	var ign = args.args[1];

	var ud = args.userData;

	if (knownGames.indexOf(gameName) == -1)
		return this.client.reply(args.message, 'Sorry, I don\'t know this game');

	ud.games = ud.games || {};
	ud.games[gameName] = ud.games[gameName] || {};

	ud.games[gameName].ign = ign;
	done();
};