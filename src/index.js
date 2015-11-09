var Bot = require('./bot');
var MongoStore = require('./bot/store/mongo');
var config = require('../config/config.json');

var bot = new Bot({
	email: config.discordEmail,
	password: config.discordPassword,
	store: new MongoStore('mongodb://localhost:27017/discord')
});

bot.connect(function() {
	console.log('Connected.');

	bot
		.command('setign')
		.describe({
			title: '!setign [game] [name]',
			description: 'Set your In Game Name. Currently supported games are LoL and Osu!.'
		})
		.withStore()
		.do(require('./tasks/setign'));

	bot
		.command('getign')
		.describe({
			title: '!getign [game]',
			description: 'Get your In Game Name.'
		})
		.withStore()
		.do(require('./tasks/getign'));

	bot
		.command('lolgame')
		.describe({
			title: '!lolgame [@user]',
			description: 'Get info about the LoL game [@user] is playing.'
		})
		.do(require('./tasks/lol-game'));

	bot
		.command('help')
		.describe({
			title: '!help',
			description: 'Get available commands.'
		})
		.do(require('./tasks/help.js'));

	bot
		.every('* * * * *')
		.forEachUserOf('112588514289258496')
		.withStore()
		.sink('112960513339633664')
		.do(require('./tasks/loldivision'));

	bot
		.every('* * * * *')
		.forEachUserOf('112588514289258496')
		.withStore()
		.sink('112960513339633664')
		.do(require('./tasks/osu-rank'));
});