module.exports = function(bot) {
	if (!bot.hasService('help'));
		bot.addService('help', bot.services.help);

	return bot
		.on(bot.triggers['mention-command'], 'help')
		.describe('Print this message.')
		.do(bot.tasks['print-help']);
};
