var Bot = require('./bot');
var triggers = Bot.triggers;
var MongoStore = require('./bot/store/mongo');
var config = require('../config/config.json');

var bot = new Bot({
	email: config.discordEmail,
	password: config.discordPassword
});

bot.connect(function() {
	console.log('Connected.');

	bot
		.on(triggers.command, 'testaestek')
		.describe({
			usage: 'Test da booty',
			describtion: 'Lowl'
		})
		.do(function(bot, conf, params) {
			console.log('ok', params.commandArgs);
			bot.client.sendMessage('112960513339633664', 'Ho!');
		});

	bot
		.on(triggers.base)
		.do(function(bot) {
			console.log(bot.getComponent('help'))
		});
});
