module.exports = function(userGetter) {
	return function() {
		this.addHelper('store', function(bot, args, done) {
			bot.getComponent('store').get(userGetter(bot, args), function(data) {
				done({
					data: data,
					done: function() {
						bot.getComponent('store').set(args.message.author, data);
					}
				});
			});
		});

		return this;
	}
};
