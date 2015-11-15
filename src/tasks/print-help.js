function strPad(input, length, string) {
	string = string || '0'; input = input + '';
	return input + (input.length >= length ? input : new Array(length - input.length + 1).join(string));
}

function replaceVars(str, vars) {
	if (!str)
		return "";

	for (var i in vars) {
		str = str.replace('%' + i, vars[i])
	}

	return str;
};

module.exports = function(bot, conf, args) {
	var msg = '**Here is the list of available commands:**\n```';

	var vars = {
		botMention: '@' + bot.client.user.username
	};

	var l = bot.getService('help').get();

	var maxTitleLength = 0;
	l.forEach(function(c) {
		maxTitleLength = c.usage.length > maxTitleLength
			? c.usage.length
			: maxTitleLength;
	});

	maxTitleLength += 3;

	l.forEach(function(c) {
		msg += strPad(replaceVars(c.usage, vars), maxTitleLength, ' ') + replaceVars(c.description, vars) + '\n';
	});

	msg += '```';

	bot.client.sendMessage(args.message, msg);
};