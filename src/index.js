var Bot = require('./bot');
var config = require('../config/config.json');

var bot = new Bot({
	email: config.discordEmail,
	password: config.discordPassword
});

bot.addService('store', bot.services['mongo-store']('mongodb://localhost/discord'));

bot
	.on(bot.triggers.command, 'hello')
	.restrict({
		channelId: '112960513339633664'
	})
	.describe({
		usage: '!hello',
		description: 'Hello, world'
	})
	.do(function(bot, conf) {
		this.reply('world');
	});

bot
	.on(bot.triggers.cron, '52 21 * * *')
	.sink('112960513339633664')
	.do(require('./tasks/bonjour-madame'));

bot.use(bot.packages.help);

bot.connect(function() {
	console.log('Connected.');
});