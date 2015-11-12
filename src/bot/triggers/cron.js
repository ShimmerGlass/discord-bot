var Base = require('./now');
var util = require("util");
var cronParser = require('cron-parser');

var Cron = function(cronExpr) {
	Base.call(this);
	this.interval = cronParser.parseExpression(cronExpr);
};

util.inherits(Cron, Base);

Cron.prototype.run = function(bot) {
	var that = this;
	this._schedule(bot);
};

Cron.prototype._schedule = function(bot) {
	var now = new Date().getTime();
	var next = this.interval.next().getTime();

	var that = this;
	setTimeout(function() {
		that.execute(bot);
		that._schedule(bot);
	}, next - now);
}

module.exports = Cron;
