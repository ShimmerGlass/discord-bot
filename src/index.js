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
		.withStore()
		.do(require('./tasks/setign'));

	bot
		.command('getign')
		.withStore()
		.do(require('./tasks/getign'));

	bot
		.every('* * * * *')
		.forEachUserOf('112588514289258496')
		.withStore()
		.sink('112588514289258496')
		.do(require('./tasks/loldivision'))
});