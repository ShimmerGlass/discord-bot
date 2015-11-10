var $ = require('cheerio')
var request = require('request')

module.exports = function(bot, conf) {
	var that = this;

	request('http://www.bonjourmadame.fr/', function(err, res, body) {
		if (err)
			return;

		var url = $(body).find('.photo.post').first().find('img').first().attr('src');

		that.sink('Madame of the day : ' + url);
	});
};
