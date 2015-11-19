var async = require('async');

var Now = function() {
	this.attrs = {};
	this.helpers = {};
};

Now.prototype.set = function(k, v) {
	this.attrs[k] = v;
};

Now.prototype.get = function(k) {
	return this.attrs[k];
};

Now.prototype.sink = function(sink) {
	var that = this;
	this.set('sink', sink);
	this.addHelper('sink', function(bot, args, cb) {
		cb(function(message) {
			bot.client.sendMessage(that.get('sink'), message)
		});
	});
	return this;
};

Now.prototype.do = function(handler) {
	this.set('handler', handler);
	return this;
};

Now.prototype.forEach = function(items) {
	this.set('forEachItems', function() { return items });
	return this;
};

Now.prototype.forEachUser = function() {
	this.set('forEachItems', function(bot, args) {
		return bot.client.users;
	});
	return this;
};

Now.prototype.forEachServer = function() {
	this.set('forEachItems', function(bot, args) {
		return bot.client.servers;
	});
	return this;
};

Now.prototype.name = function(name) {
	this.set('name', name);
	return this;
};

Now.prototype.addHelper = function(name, helper) {
	if (this.helpers[name])
		throw new Error('An helper already exists under this name');

	this.helpers[name] = helper;
};

Now.prototype.execute = function(bot, args) {
	var that = this;

	var logger = bot.getService('logger');

	if (logger)
		logger.onExec(this);

	var helpersA = [];

	for (var i in this.helpers)
		helpersA.push({ name: i, factory: this.helpers[i] });

	var repeatHelperPos = helpersA.length;

	(
		(this.get('forEachItems') && this.get('forEachItems')(bot, args)) ||
		[null]
	).forEach(function(item) {
		helpersA[repeatHelperPos] = {
			name: 'forEachItem',
			factory: function(b, a, d) { return d(item); }
		};

		async.map(
			helpersA,
			function(h, cb) {
				h.factory(bot, args, function(helper) {
					cb(null, { name: h.name, helper: helper });
				});
			},
			function(err, results) {
				var helpersO = {};
				results.forEach(function(h) {
					helpersO[h.name] = h.helper;
				});

				that.get('handler').call(helpersO, bot, this, args);
			}
		);
	});
};

Now.prototype.setup = function(bot) {
	var logger = bot.getService('logger');

	if (logger)
		logger.onRegister(this);
};

Now.prototype.run = function(bot) {
	this.execute(bot, {});
};

Now.prototype.toString = function() {
	return '[now:' + (this.get('name') || '') + ']';
};

module.exports = Now;
