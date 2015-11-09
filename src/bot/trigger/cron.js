var Base = require('./base');
var util = require("util");
var cronParser = require('cron-parser');

var Cron = function(cronExpr) {
	Base.call(this);
	this.interval = cronParser.parseExpression(cronExpr);
};

util.inherits(Cron, Base);

Cron.prototype.run = function(bot) {
	var that = this;
	this.runCronScheduledTask();
};

Cron.prototype._schedule = function() {
	var now = new Date().getTime();
	var next = this.next().getTime();

	var that = this;
	setTimeout(function() {
		that.execute(conf);
		that._schedule();
	}, next - now);
}

module.exports = Cron;
