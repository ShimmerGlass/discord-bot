module.exports = function(bot) {
	if (!bot.hasService('help'));
		bot.addService(bot.services.help);

	return bot
		.on(bot.triggers['mention-command'], 'help')
		.describe('Print this message.')
		.do(bot.tasks['print-help']);
};