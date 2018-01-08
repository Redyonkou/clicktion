var allInviteCodes = [];
var maxIterations = 20;

module.exports = {

	calcServerDate: () => {
    var date = new Date();
		return new Date();
  },

  generateKey: () => {
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
	},

	resetKeys: () => {
		allInviteCodes = [];
	},

	normalizeAnswers: (answers, correct_answer) => {
		var abcdStr = "abcd";
		if (answers[0] == undefined || answers[1] == undefined){
			return null;
		}
		if (answers[2] == undefined && answers[3] != undefined){
			return null;
		}
		var i = 0;
		while (i < 4) {
		if (answers[i] != undefined && answers[i].length == 0) {
				return null;
			}
			if (correct_answer == abcdStr[i] && answers[i] == undefined) {
				return null;
			}
			i++;
		}
		answers = answers.map(function(x) {
			if(x == undefined){
				return null;
			} else {
				return x;
			}
		});

 		return answers;
	},

	normalizeSurvey: (survey) => {
		survey = survey[0];
		var result = [{'id':survey.id, 'title':survey.title, 'answers':[]}];
		var temp = [];
		temp.push(survey.answer_A); temp.push(survey.answer_B);
		temp.push(survey.answer_C); temp.push(survey.answer_D);
		for (var i of temp) {
			if (i != null)
				result[0].answers.push(i);
		}
		return result;
	}
};

function generateRandomChar(){
	var allPossibleChars = "abcdefghijklmnopqrstuvwxyz0123456789";
	return allPossibleChars[Math.round(Math.random() * (36))];
}
