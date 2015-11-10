var Base = require('./base');
var util = require("util");
var store = require('../helpers/store');

var React = function(pattern) {
	Base.call(this);
	this.pattern = pattern;

	this.addHelper('reply', function(bot, args, cb) {
		cb(function(message) {
			bot.client.reply(args.message, message);
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

React.prototype.execute = function(bot, args) {
	var re = this.get('restrictExpr');

	if (
		re.serverId
		&& re.serverId.indexOf(args.message.channel.server.id) == -1
	)
		return;

	if (
		re.userId
		&& re.userId.indexOf(args.message.author.id) == -1
	)
		return;

	if (
		re.channelId
		&& re.channelId.indexOf(args.message.channel.id) == -1
	)
		return;

	Base.prototype.execute.call(this, bot, args);
};

React.prototype.run = function(bot) {
	var that = this;

	bot.client.on('message', function(message) {
		if (!message.content.match(that.pattern))
			return;

		that.execute(bot, message);
	});
};

module.exports = React;
