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


React.prototype.withStore = store(function(bot, args) {
	return args.message.author;
});

React.prototype.run = function(bot) {
	var that = this;

	bot.client.on('message', function(message) {
		if (!message.content.match(that.pattern))
			return;

		that.execute(bot, message);
	});
};

module.exports = React;
