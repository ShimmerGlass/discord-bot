var Bot = require('./bot');
var config = require('../config/config.json');

var bot = new Bot({
	email: config.discordEmail,
	password: config.discordPassword
});

bot.connect(function() {
	console.log('Connected.');

	bot.addComponent('store', bot.components['mongo-store']('mongodb://localhost/discord'));

	// bot
	// 	.on(bot.triggers.command, 'testaestek')
	// 	.restrict({
	// 		channelId: '112960513339633664'
	// 	})
	// 	.describe({
	// 		usage: 'Test da booty',
	// 		description: 'Lowl'
	// 	})
	// 	.do(function(bot, conf, params) {
	// 		console.log('ok', params.commandArgs);
	// 	});

	bot
		.on(bot.triggers.base)
		.forEachUser()
		.do(function(bot, conf, params) {
			console.log(this.forEachItem.username);
		});

	// bot
	// 	.on(bot.triggers.cron, '12 15 * * *')
	// 	.sink('112588514289258496')
	// 	.do(require('./tasks/bonjour-madame'));

	bot.use(bot.packages.help);
});
