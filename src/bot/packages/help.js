module.exports = function(bot) {
	if (!bot.hasService('help'));
		bot.addService(bot.services.help);

	return bot
		.on(bot.triggers.command, 'help')
		.do(bot.tasks['print-help']);
};