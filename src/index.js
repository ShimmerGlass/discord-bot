var Bot = require('./bot');
var MongoStore = require('./bot/store/mongo');
var config = require('../config/config.json');

var bot = new Bot({
	email: config.discordEmail,
	password: config.discordPassword
});

bot.connect(function() {
	console.log('Connected.');

	bot
		.on(bot.triggers.command, 'testaestek')
		.describe({
			usage: 'Test da booty',
			description: 'Lowl'
		})
		.do(function(bot, conf, params) {
			console.log('ok', params.commandArgs);
			bot.client.sendMessage('112960513339633664', 'Ho!');
		});

	bot.use(bot.packages.help);
});
