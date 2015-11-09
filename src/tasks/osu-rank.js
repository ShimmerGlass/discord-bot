var config = require('../../config/config.json');
var request = require('request');

function getRank(pname, callback) {
	var url = 'https://osu.ppy.sh/api/get_user?k=' + config.osuKey + '&u=' + pname;
	request(url, function(err, res, body) {
		var data = JSON.parse(body);

		callback(parseInt(data[0].pp_rank));
	});
}


module.exports = function(args, done) {
	var that = this;
	var ud = args.userData;

	if (!ud.games || !ud.games.osu || !ud.games.osu.ign)
		return;

	getRank(ud.games.osu.ign, function(rank) {
		if (Math.abs(rank - (ud.games.osu.rank || 0)) > 1000)
			that.client.sendMessage(that.get('sink'), args.user.mention() + ' is now **' + rank + '\'th** on Osu!');

		ud.games.osu.rank = rank;
		done();
	});
};