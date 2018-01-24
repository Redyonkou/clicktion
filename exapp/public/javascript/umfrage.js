var app;
var socket=io();
var server="http://localhost:3000";
var key;


window.onload = function(){
$("#umfrage").hide();
$("#statbtn").hide();
key=getParameterByName("id");
if(key!=null){
socket.emit("surveykey", key);
}

app = new Vue ({

el: "#body_div",
data: {
  frage: "Frage wird geladen...",
  antworten: [],
  fragentyp: "0",
  akey: key
},
created: function(){
  if(key!=null){
    this.fetchData();
  }
},
methods: {
  fetchData: function(){
    this.frage="Frage wird geladen...";
    //this.$http.get(server+"/db/all").then(response => {
    this.$http.get(server+"/db/survey?id="+this.$data.akey).then(response => {
      this.addAnswers(response.body[0]);
    }, response => {this.frage = "Fehler beim Laden der Frage. Fehlercode: " + response.status + " " + response.statusText;})
  },
  addAnswers: function(resdata){
    console.log(resdata);
    this.fragentyp=resdata.type;
    this.frage=resdata.title;
    if(this.fragentyp=="clicker"){
      $("#umfrage").show();
      $("#statbtn").show();
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

  },
  setKeyAndRequest: function(){
    var key = $("#keysearchbar").val();
    this.fetchData();
  },
  sendAnswer: function(){
    $("#submitbutton").attr("disabled", true);
    var chosenAnswer="none";
    var submitURL;
    if($("#btn1").is(".active")) chosenAnswer="a";
    if($("#btn2").is(".active")) chosenAnswer="b";
    if($("#btn3").is(".active")) chosenAnswer="c";
    if($("#btn4").is(".active")) chosenAnswer="d";
    submitURL=server+"/db/submit?id="+key+"&answer="+chosenAnswer;

    $.post(submitURL, ()=>{
      $("#submitbutton").prop("disabled", true);
    }).fail(()=>{
      $("#submitbutton").prop("disabled", false);
      });
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

    $.post(submitURL, ()=>{
      $("#submitbutton").prop("disabled", true);
    }).fail(()=>{
      $("#submitbutton").prop("disabled", false);
      });
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

function openStatistics(){
  window.open(server+"/statistics?id="+key);
}
