/**
/* name: my_surveys.js
/* function: get my surveys and allow starting surveys
/* author: jojahn
/* created on: 12.2017 
*/

var app = new Vue({
	el: "#app",
	data: {
		allSurveys: null,
		key: "",
		status: null,
		name: "test",
		token: ""
	},
	methods: {

		// fetch all my surveys
		getMySurveys: function(token) {
			this.$data.token = token;
			Vue.http.headers.common['Authorization'] = 'Bearer ' + token;
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

		// start one survey by key
		startSurvey: function(key) {
			Vue.http.headers.common['Authorization'] = 'Bearer ' + this.$data.token;
			this.$http.post('/db/start?id=' + key)
				.then(function(response) {
					this.displayStatus("Umfrage " + key + " wurde gestartet");
				})
				.catch(function(err) {
					this.displayStatus("Umfrage " + key + " konnte nicht gestartet werden!");
				})
		},

		// display status-text
		displayStatus: function(str) {
			this.$data.status = str;
		}
	}
});

function onSignIn(googleUser) {
	var id_token = googleUser.getAuthResponse().id_token;
	app.getMySurveys(id_token);
}