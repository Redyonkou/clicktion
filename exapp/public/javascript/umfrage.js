var app;
var socket=io();
var server="http://localhost:3000";
var key;


window.onload = function(){
key=getParameterByName("id");

socket.emit("surveykey", key);

console.log("Fragen-ID="+key);

app = new Vue ({

el: "#umfrage",
data: {
  frage: "Frage wird geladen...",
  antworten: [],
  fragentyp: "0"
},
created: function(){
  this.fetchData();
},
methods: {
  fetchData: function(){
//Get-Request muss noch geändert werden. Sucht im Moment nach allen Umfragen und nimmt die erste aus Testzwecken 
    //this.$http.get(server+"/db/all").then(response => {
    this.$http.get(server+"/db/survey?id="+key).then(response => {
      this.addAnswers(response.body[0]);
    }, response => {this.frage = "Fehler beim Laden der Frage. Fehlercode: " + response.status + response.statusText;})
  },
  addAnswers: function(resdata){
    var zahlGerade = true;
    this.fragentyp=resdata.type;
    this.frage=resdata.title;
    if(this.fragentyp=="clicker"){
      var antwortanzahl=0;
      console.log(resdata);
      this.antworten.push(resdata.answer_A, resdata.answer_B, resdata.answer_C, resdata.answer_D);
      this.antworten.forEach(item => {
	if(item!=null)
	  antwortanzahl=antwortanzahl+1;})
      if(antwortanzahl==2) {
	$("#secondrow").children().hide();
      }
      if(antwortanzahl==3) {
	$("#btn4").hide();
	$("#span2").remove();
	$("#btn3").removeClass("col-md").addClass("col-md-6").css({"float": "none","margin": "0 auto"});
      }
    }
  },
  switchActiveBtn: function(clickedbtn){
    $(".antwortenbtn").attr("aria-pressed", "false").removeClass("active");

  }
}
});
}

socket.on("connect", ()=> {
  socket.on("answercollection", ()=> {
    var chosenAnswer="none";
    var submitURL;
    if($("#btn1").is(".active")) chosenAnswer="a";
    if($("#btn2").is(".active")) chosenAnswer="b";
    if($("#btn3").is(".active")) chosenAnswer="c";
    if($("#btn4").is(".active")) chosenAnswer="d";
    submitURL=server+"/db/submit?id="+key+"&answer="+chosenAnswer;

    console.log("sending chosen answer: " + chosenAnswer);
    $.post(submitURL);
  });
});

function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}
