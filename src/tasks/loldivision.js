var LolApi = require('leagueapi');
var config = require('../../config/config.json');

LolApi.init(config.riotKey, 'euw');

function ucfirst(string) {
	return string.charAt(0).toUpperCase() + string.slice(1);
}

function getDivision(pname, callback) {
	pname = pname.toLowerCase();

	LolApi.Summoner.getByName(pname, 'euw', function(err, summoner) {
		if (err)
			return console.err(err);

		LolApi.getLeagueEntryData(summoner[pname].id, 'euw', function(err, data) {
			if (err)
				return;

			var tier = data[summoner[pname].id][0].tier;
			var divisionStr = ucfirst(tier.toLowerCase()) + data[summoner[pname].id][0].entries[0].division;
			callback(divisionStr);
		});
	});
};

module.exports = function(args, done) {
	var that = this;
	var ud = args.userData;

	if (!ud.games || !ud.games.lol && ud.games.lol.ign)
		return;

	getDivision(ud.games.lol.ign, function(divisionStr) {
		if (divisionStr != ud.games.lol.division)
			that.client.sendMessage(that.get('sink'), args.user.mention() + ' is now **' + divisionStr + '** on LoL');

		ud.games.lol.division = divisionStr;
		done();
	});
};