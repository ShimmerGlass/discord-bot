var webshot = require('webshot');

module.exports = function(args, done) {
	var that = this;

	var player = args.message.mentions[0];

	if (!player)
		this.client.reply(args.message, 'Nobody mentionned :(');

	this.bot.userStore.get(player, function(ud) {
		if (!ud.games || !ud.games.lol || !ud.games.lol.ign)
			return that.client.reply(args.message, 'Sorry, I don\'t know ' + player.username + '\'s name for this game.');

		var fname = '/tmp/' + Math.random() + '.png';

		webshot('http://www.lolskill.net/game/EUW/' + ud.games.lol.ign, fname, {
			screenSize: { width: 1240, height: 970 },
			shotOffset: { top: 170 },
			quality: 75
		}, function(err) {
			if (err)
				console.log(err);

			that.client.sendFile(args.message, fname);
		});
	});
};