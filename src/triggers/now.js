var async = require('async');
var _ = require('underscore');

var Now = function() {
	var that = this;

	this.attrs = {};
	this.helpers = {};

	this.addHelper('updatingMessage', function(bot, args, cb) {
		cb(function(target, steps) {
			var message;
			var stepIndex = 0;

			function runStep() {
				var step = steps[stepIndex];
				steps[stepIndex].call(that, function(msgTxt) {
					var sendCb = function(err, newMessage) {
						if (err)
							return;

						message = newMessage;

						stepIndex++;

						if (steps[stepIndex])
							runStep();
					};

					if (!message)
						bot.sendMessage(target, msgTxt, sendCb);
					else
						bot.updateMessage(message, msgTxt, sendCb)
				}, message);
			};

			runStep();
		});
	});

	this.addHelper('log', function(bot, args, cb) {
		cb(function(msg) {
			bot.getService('logger').log(msg);
		});
	});
};

Now.prototype.set = function(k, v) {
	this.attrs[k] = v;
};

Now.prototype.get = function(k) {
	return this.attrs[k];
};

Now.prototype.sink = function(sinks) {
	var that = this;

	if (!Array.isArray(sinks))
		sinks = [sinks];

	this.set('sink', sinks);

	this.addHelper('sink', function(bot, args, cb) {
		cb(function(message, callback) {
			async.eachSeries(sinks, function(sink, cb) {
				bot.client.sendMessage(sink, message, cb);
			}, callback);
		});
	});

	return this;
};

Now.prototype.userSink = function(sinks) {
	var that = this;

	if (!Array.isArray(sinks))
		sinks = [sinks];

	this.set('userSink', sinks);

	this.addHelper('userSink', function(bot, args, cb) {
		cb(function(user, message) {
			sinks.forEach(function(sink) {
				bot.client.resolveDestination(sink).then(function(destination) {
					var destination = bot.client.getChannel('id', destination);

					if (!_.find(destination.server.members, function(s) {
						return s.id == user.id;
					}))
						return;

					bot.client.sendMessage(destination, message);
				});
			});
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
