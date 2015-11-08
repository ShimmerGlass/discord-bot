module.exports = function(args, done) {
	var gameName = args.args[0];

	var ud = args.userData;

	if (!ud.games || !ud.games[gameName] || !ud.games[gameName].ign)
		return this.client.reply(args.message, 'Sorry, I don\'t know your name for this game.');

	this.client.reply(args.message, 'Your name on ' + gameName + ' is ' + ud.games[gameName].ign);
	done();
};