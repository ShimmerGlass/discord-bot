var Discord = require("discord.js");
var Conf = require('./conf');
var argParser = require('./parse-args');
var cronParser = require('cron-parser');

function QuoteRegExp(str) {
	return (str + '').replace(/[.?*+^$[\]\\(){}|-]/g, "\\$&");
};

var BotMaker = function(conf) {
	this.userStore = conf.store;
	this.email = conf.email;
	this.password = conf.password;

	this.client = new Discord.Client();
	this.reacthandlers = [];

	this.commandsSynopses = [];

	var that = this;

	this.client.on('message', function(message) {
		that.handleMessage(message);
	});
};

BotMaker.prototype.connect = function(cb) {
	this.client.login(this.email, this.password);
	var nbDone = 0;
	var expected = this.userStore ? 2 : 1;

	var hc = function() {
		nbDone++;
		if (nbDone >= expected)
			cb();
	};

	this.client.on('ready', hc);

	if (this.userStore)
		this.userStore.connect(hc);
}

BotMaker.prototype.react = function(pattern) {
	pattern = pattern instanceof RegExp
		? pattern
		: new RegExp(pattern);

	var c = new Conf(this);

	this.reacthandlers.push({
		pattern: pattern,
		conf: c
	});

	return c;
};

BotMaker.prototype.command = function(cmdName) {
	var that = this;

	var pattern = new RegExp('^!' + QuoteRegExp(cmdName) + '(\\s+(.+))?$');
	var c = new Conf(this);

	this.react(pattern).do(function(args) {
		var rawArgs = pattern.exec(args.message.content)[2];
		var cmdArgs = rawArgs
			? argParser(rawArgs)
			: [];

		that.executeTask(c, {
			message: args.message,
			args: cmdArgs,
			user: args.message.author
		});
	});

	return c;
};

BotMaker.prototype.every = function(cronExpr) {
	var interval = cronParser.parseExpression(cronExpr);
	var c = new Conf(this);

	this.runCronScheduledTask(interval, c);
	return c;
};

BotMaker.prototype.now = function() {
	var c = new Conf(this);
	var that = this;

	setTimeout(function() {
		that.executeTask(c);
	});

	return c;
};

BotMaker.prototype.runCronScheduledTask = function(interval, conf) {
	var now = new Date().getTime();
	var next = interval.next().getTime();

	var that = this;
	setTimeout(function() {
		that.executeTask(conf);
		that.runCronScheduledTask(interval, conf);
	}, next - now);
};

BotMaker.prototype.handleMessage = function(message) {
	var that = this;

	this.reacthandlers.forEach(function(h) {
		if (!message.content.match(h.pattern))
			return;

		that.executeTask(h.conf, {
			message: message,
			user: message.author
		});
	});
};

BotMaker.prototype._populateArgsWithUserData = function(conf, args, callback) {
	if (!conf.get('withStore'))
		return callback(args);

	if (conf.isWithStore && !this.userStore)
		throw new Error('No store configured');

	if (conf.isWithStore && !this.userStore.isConnected())
		throw new Error('Store is not connected');

	this.userStore.get(args.user, function(data) {
		args.userData = data;

		callback(args);
	});
};

BotMaker.prototype._doExecuteTask = function(conf, args) {
	var that = this;
	this._populateArgsWithUserData(conf, args, function(args) {
		conf.get('handler').call(conf, args, function() {
			if (args.userData)
				that.userStore.set(args.userData, function() {});
		});
	});
};

BotMaker.prototype.executeTask = function(conf, args) {
	var that = this;
	var emptyCb = function() {};
	args = args || {};

	function clone(obj) {
		if (null == obj || "object" != typeof obj) return obj;
		var copy = obj.constructor();
		for (var attr in obj) {
			if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
		}
		return copy;
	}

	if (!conf.get('handler'))
		throw new Error('No handler specified');

	if (!conf.get('forEachUserOf'))
		this._doExecuteTask(conf, args);
	else
		conf.get('forEachUserOf').members.forEach(function(member) {
			var nargs = clone(args);
			nargs.user = member;
			that._doExecuteTask(conf, nargs);
		});
};

BotMaker.prototype.addCommandSynopsis = function(synopsis) {
	this.commandsSynopses.push(synopsis);
};

BotMaker.prototype.getCommandsSynopses = function() {
	return this.commandsSynopses;
};

module.exports = BotMaker;