var Base = require('./now');
var util = require("util");
var store = require('../helpers/store');

var React = function(pattern) {
	Base.call(this);
	this.pattern = pattern;

	this.addHelper('reply', function(bot, args, cb) {
		cb(function(message) {
			bot.reply(args.message, message);
		});
	});
};

util.inherits(React, Base);

React.prototype.restrict = function(restrictExpr) {
	if (restrictExpr.serverId && !Array.isArray(restrictExpr.serverId))
		restrictExpr.serverId = [restrictExpr.serverId];

	if (restrictExpr.userId && !Array.isArray(restrictExpr.userId))
		restrictExpr.userId = [restrictExpr.userId];

	if (restrictExpr.channelId && !Array.isArray(restrictExpr.channelId))
		restrictExpr.channelId = [restrictExpr.channelId];

	this.set('restrictExpr', restrictExpr);
	return this;
};

React.prototype.withStore = store(function(bot, args) {
	return args.message.author;
});

React.prototype.matchRestriction = function(message) {
	var re = this.get('restrictExpr');

	if (re) {
		if (
			re.serverId &&
			(
				!message.channel.server ||
				re.serverId.indexOf(message.channel.server.id) == -1
			)
		)
			return false;

		if (
			re.userId
			&& re.userId.indexOf(message.author.id) == -1
		)
			return false;

		if (
			re.channelId
			&& re.channelId.indexOf(message.channel.id) == -1
		)
			return false;
	}

	return true;
}

React.prototype.execute = function(bot, args) {
	if (!this.matchRestriction(args.message))
		return;

	Base.prototype.execute.call(this, bot, args);
};

React.prototype.run = function(bot) {
	var that = this;

	bot.client.on('message', function(message) {
		if (message.author.id == bot.client.user.id)
			return;

		if (!message.content.match(that.pattern))
			return;

		that.execute(bot, { message: message });
	});
};

React.prototype.toString = function() {
	return '[react ' + this.pattern + ':' + (this.get('name') || '') + ']';
};


module.exports = React;
