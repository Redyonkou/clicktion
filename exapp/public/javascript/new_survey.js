var app = new Vue ({
  el: "#app",
	data: {
    Alpha: ['a', 'b', 'c', 'd'],
    type: 1,
    title: "",
    name: "riko",
    correct: undefined,
    answers: [
    {'id':'a', 'text':null, 'isActive': false},
    {'id':'b', 'text':null, 'isActive': false},
    {'id':'c', 'text':null, 'isActive': false},
    {'id':'d', 'text':null, 'isActive': false}]
  }, 
  methods: {

  saveSurvey: function() {
    this.buildAnswers();
    var obj = this.buildRequestObject();
    /*this.$http.put('/db/new/', obj)
    .then(function(response) {
      console.log(response);
    })
    .catch(function(err) {
      console.log("--err "+ JSON.stringify(err));
    })*/
    console.log(JSON.stringify(obj));
    //window.location.href = "/home";
	},

  buildRequestObject: function() {
    var alpha = this.$data.Alpha;

    var typeStr = (this.$data.type == 0) ? "text" : "clicker";
    var answers = this.$data.answers;
    var filtered_answers = answers.filter(function(x) {
      if(x.text != null){
        return x;
      }
    });

    var obj = {'name':this.$data.name,'title':this.$data.title,'type':typeStr};
    for (var i in filtered_answers){
      obj[alpha[i]] = filtered_answers[i].text;
    }

    var correct = this.$data.correct;
    correct = (this.$data.correct != undefined && answers.find(function(x) {return x.id == correct}).text != null) ? this.$data.correct : null;

    obj['correct'] = correct;

    return obj;
  },

	buildAnswers: function() {
    this.$data.answers = this.$data.answers.map(function(x) {
      if(x.text != null && x.text.length == 0){
        return {'id':x.id, 'text':null, 'isActive':x.isActive};
      } else {
        return x;
      }
    })
	},

	setCorrectAnswer: function(x, str) {
    this.buildAnswers();
		this.$data.correct = str;
    var j = 0;
		for (i of this.$data.answers){
      // x is already active so deactivate it!
			if (i == this.$data.answers[x] && i.isActive){
        this.$data.correct = undefined;
				i.isActive=false;
			} 
      // x is not active but i is so activate i
      else if (i.isActive && this.$data.answers[x].text == null) {
				i.isActive=true;
			} 
      // x is not null so activate it!
      else if (i == this.$data.answers[x] && i.text != null){
        i.isActive=true;
      }
      else {
        i.isActive=false;
      }
      j++;
		}
	}
}
})
