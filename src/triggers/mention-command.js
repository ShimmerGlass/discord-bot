var Base  = require('./command');
var util  = require("util");
var store = require('../helpers/store');

var MentionCommand = function(command, argsName) {
	Base.call(this, command, argsName);
};

util.inherits(MentionCommand, Base);

MentionCommand.prototype._getSynopsis = function() {
	var s = this.get('synopsis');

	if (typeof s == 'string' || !s) {
		var usage = '%botMention ' + this.command;
		if (this.argsName)
			usage += ' [' + this.argsName.join('] [') + ']';

		return {
			usage: usage,
			description: s
		};
	} else {
		return s;
	}
};

MentionCommand.prototype.run = function(bot) {
	var that = this;

	bot.client.on('message', function(message) {
		var args;
		var cmd;
		var mapMentions = message.mentions;

		if (!message.isPrivate) {
			if (!message.mentions[0])
				return;

			if (message.mentions[0].id != bot.client.user.id)
				return;

			if (!message.content.match(/^\s*<@\d+>/))
				return;

			args = that._parseArgs(message.content);
			args.shift();
			cmd = args.shift();
			mapMentions = message.mentions.slice(1);
		} else {
			args = that._parseArgs(message.content);
			cmd = args.shift();
		}

		if (cmd != that.command)
			return;

		if (that.argsName) {
			args = that._mapArgs(args, mapMentions, that.argsName);
		}

		that.execute(bot, {
			message: message,
			commandArgs: args
		});
	});
};

MentionCommand.prototype.toString = function() {
	return '[mention-command ' + this.command + ':' + (this.get('name') || '') + ']';
};


module.exports = MentionCommand;
