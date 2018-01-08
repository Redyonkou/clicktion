var app = new Vue ({
el: "#app",
data: {
allSurveys: null,
key: "",
status: "",
name: "riko"
}, methods: {
getMySurveys: function() {
      this.$http.get('/db/all/'+this.$data.name)
      .then(function(response) {
          this.$data.allSurveys = response.body;
          this.$data.status = "Alle Umfragen wurden geladen"
      })
      .catch(function(err) {
        	this.$data.status = "Umfragen konnten nicht geladen werden!"
      })
	},
startSurvey: function(key) {
	 this.$http.post('/db/start/?name='+"riko"+"&key="+key)
     .then(function(response) {
     		this.$data.status = "Umfrage "+key+" wurde gestartet";
      })
      .catch(function(err) {
      	this.$data.status = "Umfrage "+key+" konnte nicht gestartet werden!";
      })
}

}, mounted: function() {
	this.getMySurveys();
}
})