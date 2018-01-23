server="http://localhost:3000";
var app;
var key;

window.onload = function(){
  
  key=getParameterByName("id");
  

  app = new Vue ({

  el: "#umfrage",
  data: {
    errormsg: " ",
    anzahl: []
  },
  created: function(){
    if(key!=null){
      this.fetchData();
    }
  },
  methods: {
    fetchData: function(){
      this.$http.get(server+"/db/results?id="+key).then(response => {
        this.errormsg=" ";
        var resdata = response.body[0];
	$("#"+resdata.correct+"-bg").css("background-color", "darkgreen");
	this.anzahl.push(resdata.sum_a, resdata.sum_b, resdata.sum_c, resdata.sum_d);
        $("#a-bar").css("height", Math.round(resdata.sum_a/resdata.sum_all*200)+"px");
        $("#b-bar").css("height", Math.round(resdata.sum_b/resdata.sum_all*200)+"px");
        $("#c-bar").css("height", Math.round(resdata.sum_c/resdata.sum_all*200)+"px");
        $("#d-bar").css("height", Math.round(resdata.sum_d/resdata.sum_all*200)+"px");
      }, response => {
        this.errormsg="Fehler beim Laden der Statistik. Fehlercode: " + response.status + " " + response.statusText;
      })
    },
    getData: function(){
      key = $("#keysearchbar").val();
      fetchData();
    }
  }
  });
}

function getParameterByName(name, url) {
  if (!url) url = window.location.href;
  name = name.replace(/[\[\]]/g, "\\$&");
  var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
      results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, " "));
}
