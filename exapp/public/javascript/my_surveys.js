var app = new Vue ({
el: "#app",
data: {
allSurveys: [],
key: "",
status: null,
name: "test",
token: "" }, 
methods: {

getMySurveys: function(token) {
	this.$data.token = token;
	Vue.http.headers.common['Authorization'] = 'Bearer '+token;
	 this.$http.get('/db/my')
	 .then(function(response) {
		this.$data.allSurveys = response.body;
		if (response.body.length != 0)
			this.displayStatus("Alle Umfragen wurden geladen");
	 })
	.catch(function(err) {
		this.displayStatus("Umfragen konnten nicht geladen werden!");
	})
},

startSurvey: function(key) {
	Vue.http.headers.common['Authorization'] = 'Bearer '+this.$data.token;
	this.$http.post('/db/start?id='+key)
	.then(function(response) {
		alert("hu");
		this.displayStatus("Umfrage "+key+" wurde gestartet");
	})
	.catch(function(err) {
		alert("damn");
		this.displayStatus("Umfrage "+key+" konnte nicht gestartet werden!");
	})
},

displayStatus: function(str) {
	this.$data.status = str;
	if (str != null)
		setTimeout(function () { this.$data.status = null }.bind(this), 3000)
}
}	
});

function onSignIn(googleUser) {
  var id_token = googleUser.getAuthResponse().id_token;
  app.getMySurveys(id_token);
}