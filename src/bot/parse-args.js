module.exports = function(rawArgs) {
	var args = [];
	var argi = 0;
	var escaped = false;
	var inquotes = false;
	for (var i = 0; i < rawArgs.length; i++) {
		var c = rawArgs[i];

		if (c == '\\') {
			escaped = true;
		} else {
			if (c == ' ' && !inquotes && args[argi]) {
				argi++;
			} else if (c == '"' && !escaped && inquotes) {
				inquotes = false;
			} else if (c == '"' && !escaped && !inquotes) {
				inquotes = true;
			} else {

				if (!args[argi])
					args[argi] = '';

				args[argi] += c;
			}

			escaped = false;
		}
	}

	return args;
};