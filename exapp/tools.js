var allInviteCodes = [];
var maxIterations = 20;

module.exports = {
  calcSemester: function () {
    var date = new Date();
	var result = date.getFullYear();
	if (date.getMonth() > 6) {
		result += " WS";
	} else {
		result += " SS";
	}
	return result;
  },
  generateKey: function () {
  	var i = 0;
		var code = "";
		do {
		[0,1,2,3].forEach((i) => {
			code += generateRandomChar();
		});
		i++;
		} while (i < maxIterations && allInviteCodes.includes(code));
		allInviteCodes.push(code);
		return code;
	}
};

function generateRandomChar(){
	var allPossibleChars = "abcdefghijklmnopqrstuvwxyz0123456789";
	return allPossibleChars[Math.round(Math.random() * (36))];
}
