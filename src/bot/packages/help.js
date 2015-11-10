module.exports = function(bot) {
	if (!bot.hasComponent('help'));
		bot.addComponent(bot.components.help);

	return bot
		.on(bot.triggers.command, 'help')
		.do(bot.tasks['print-help']);
};