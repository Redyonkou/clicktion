var url = window.location.href;
var error_app = new Vue ({
el: "#err",
data: {
errcode: '',
errmsg: ''
}, mounted: function() {
 	this.$http.get(url)
    .then(function(response) {
    	this.$data.errcode = "404";
    	this.$data.errmsg = "Bad Request";
	}).catch(function(error) {
		console.log(error.status + ":" +error.statusText);
    	this.$data.errcode = error.status;
    	this.$data.errmsg = error.statusText;
	})	
}
})