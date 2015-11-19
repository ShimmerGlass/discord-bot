var Base  = require('./react');
var util  = require("util");
var store = require('../helpers/store');

var Command = function(command, argsName) {
	Base.call(this);
	this.command = command;
	this.argsName = argsName;
};

util.inherits(Command, Base);

Command.prototype._parseArgs = function(rawArgs) {
	var args = [];
	var argi = 0;
	var escaped = false;
	var inquotes = false;
	for (var i = 0; i < rawArgs.length; i++) {
		var c = rawArgs[i];

		if (c == '\\') {
			escaped = true;
		} else {
			if (c == ' ' && !inquotes && args[argi]) {
				argi++;
			} else if (c == '"' && !escaped && inquotes) {
				inquotes = false;
			} else if (c == '"' && !escaped && !inquotes) {
				inquotes = true;
			} else if (c != ' ' || inquotes) {
				if (!args[argi])
					args[argi] = '';

				args[argi] += c;
			}

			escaped = false;
		}
	}

	return args;
};

Command.prototype._mapArgs = function(args, mentions, map) {
	var mentionIdx = 0;
	var mappedArgs = {};
	for (var i = 0; i < map.length; i++) {
		var argName = map[i];
		var isMention = argName.substr(0, 1) == '@';

		if (isMention)
			argName = argName.substr(1);

		if (!isMention)
			mappedArgs[argName] = args[i];
		else {
			mappedArgs[argName] = mentions[mentionIdx];
			mentionIdx++;
		}
	}

	return mappedArgs;
};

Command.prototype.describe = function(synopsis) {
	this.set('synopsis', synopsis);
	return this;
};

Command.prototype._getSynopsis = function() {
	var s = this.get('synopsis');

	if (typeof s == 'string' || !s) {
		var usage = '!' + this.command;
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

Command.prototype.setup = function(bot) {
	Base.prototype.setup.call(this, bot);

	var s = this._getSynopsis();
	var helpService = bot.getService('help');

	if (s && helpService)
		helpService.add(this, s);
};

Command.prototype.run = function(bot) {
	var that = this;

	var cmdStartLength = this.command.length + 1;

	bot.client.on('message', function(message) {
		if (message.content.substr(0, cmdStartLength) != '!' + that.command)
			return;

		var rawArgs = message.content.substr(cmdStartLength);
		var cmdArgs = rawArgs
			? that._parseArgs(rawArgs)
			: [];

		if (that.argsName)
			cmdArgs = that._mapArgs(cmdArgs, message.mentions, that.argsName);

		that.execute(bot, {
			message: message,
			commandArgs: cmdArgs
		});
	});
};

Command.prototype.toString = function() {
	return '[command ' + this.command + ':' + (this.get('name') || '') + ']';
};


module.exports = Command;
