function strPad(input, length, string) {
	string = string || '0'; input = input + '';
	return input + (input.length >= length ? input : new Array(length - input.length + 1).join(string));
}

module.exports = function(bot, conf, args) {
	var msg = '**Here is the list of available commands:**\n```';

	var l = bot.getService('help').get();

	var maxTitleLength = 0;
	l.forEach(function(c) {
		maxTitleLength = c.usage.length > maxTitleLength
			? c.usage.length
			: maxTitleLength;
	});

	maxTitleLength += 3;

	l.forEach(function(c) {
		msg += strPad(c.usage, maxTitleLength, ' ') + c.description + '\n';
	});

	msg += '```';

	bot.client.sendMessage(args.message, msg);
};