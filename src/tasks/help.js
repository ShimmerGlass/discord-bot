function strPad(input, length, string) {
	string = string || '0'; input = input + '';
	return input + (input.length >= length ? input : new Array(length - input.length + 1).join(string));
}

module.exports = function(args, done) {
	var msg = '**Here is the list of available commands:**\n```';

	var l = this.bot.getCommandsSynopses();

	var maxTitleLength = 0;
	l.forEach(function(c) {
		maxTitleLength = c.title.length > maxTitleLength
			? c.title.length
			: maxTitleLength;
	});

	maxTitleLength += 3;

	l.forEach(function(c) {
		msg += strPad(c.title, maxTitleLength, ' ') + c.description + '\n';
	});

	msg += '```';

	this.client.sendMessage(args.message, msg);
}