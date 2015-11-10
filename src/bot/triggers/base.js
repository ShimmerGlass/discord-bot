var async = require('async');

var Trigger = function() {
	this.attrs = {};
	this.helpers = {};
};

Trigger.prototype.set = function(k, v) {
	this.attrs[k] = v;
};

Trigger.prototype.get = function(k) {
	return this.attrs[k];
};

Trigger.prototype.sink = function(sink) {
	var that = this;
	this.set('sink', sink);
	this.addHelper('sink', function(bot, args, cb) {
		cb(function(message) {
			bot.client.sendMessage(that.get('sink'), message)
		});
	});
	return this;
};

Trigger.prototype.do = function(handler) {
	this.set('handler', handler);
	return this;
};

Trigger.prototype.describe = function(synopsis) {
	this.set('synopsis', synopsis);
	return this;
};

Trigger.prototype.forEach = function(items) {
	this.set('forEachItems', function() { return items });
	return this;
};

Trigger.prototype.forEachUser = function() {
	this.set('forEachItems', function(bot, args) {
		return bot.client.users;
	});
	return this;
};

Trigger.prototype.forEachServer = function() {
	this.set('forEachItems', function(bot, args) {
		return bot.client.servers;
	});
	return this;
};

Trigger.prototype.addHelper = function(name, helper) {
	if (this.helpers[name])
		throw new Error('An helper already exists under this name');

	this.helpers[name] = helper;
};

Trigger.prototype.execute = function(bot, args) {
	var that = this;
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

Trigger.prototype.setup = function(bot) {
	if (this.get('synopsis'))
		bot.getComponent('help').add(this.get('synopsis'));
};

Trigger.prototype.run = function(bot) {
	this.execute(bot, {});
};

module.exports = Trigger;
