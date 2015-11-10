var Bot = require('./bot');
var config = require('../config/config.json');

var bot = new Bot({
	email: config.discordEmail,
	password: config.discordPassword
});

bot.connect(function() {
	console.log('Connected.');

	bot.addComponent('store', bot.components['mongo-store']('mongodb://localhost/discord'));

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

	bot
		.on(bot.triggers.command, 'teststore')
		.withStore()
		.do(function(bot, conf, params) {
			this.store.data.test = this.store.data.test || 0;
			this.store.data.test++;

			this.reply(this.store.data.test);
			this.store.done();
		});

	bot
		.on(bot.triggers.cron, '12 15 * * *')
		.sink('112588514289258496')
		.do(require('./tasks/bonjour-madame'));

	bot.use(bot.packages.help);
});
