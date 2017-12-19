var app = new Vue ({
el: "#newlecture",
data: {
semester: "",
professor: "riko",
id: "",
course: "",
fullname: "",
status:""
}, methods: {
  	getCurrentSemester: function() {
		this.$http.get('http://localhost:3000/semester')
        	.then(function(response) {
          		this.$data.semester = response.body;
      		})
      		.catch(function(err) {
          		this.$data.semester = "9999 WS"
      		})
	}
}, mounted: function() {
	this.getCurrentSemester();
}
})