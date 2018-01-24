const server="http://localhost:3000";
let app;
//let socket=io();
let key;


window.onload = function(){
$("#umfrage").hide();
$("#statbtn").hide();
key=getParameterByName("id");
/*if(key!=null){
socket.emit("surveykey", key);
}*/

app = new Vue ({

el: "#body_div",
data: {
  frage: "Frage wird geladen...",
  antworten: [],
},
created: function(){
  if(key!=null){
    this.fetchData();
  }
},
methods: {
  fetchData: function(){
    this.frage="Frage wird geladen...";
    this.$http.get(server+"/db/survey?id="+key).then(response => {
      this.addAnswers(response.body[0]);
    }, response => {this.frage = "Fehler beim Laden der Frage. Fehlercode: " + response.status + " " + response.statusText;
       $("#umfrage").show();
       $(".card-body").hide();
       $("#statbtn").hide();})
  },
  addAnswers: function(resdata){
      let antwortanzahl=0;
      this.frage=resdata.title;
      $("#umfrage").show();
      $("#statbtn").show();
      $(".card-body").show();
      this.antworten=resdata.answers;
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
  },
  switchActiveBtn: function(clickedbtn){
    $(".antwortenbtn").attr("aria-pressed", "false").removeClass("active");

  },
  setKeyAndRequest: function(){
    key = $("#keysearchbar").val();
    this.fetchData();
  },
  sendAnswer: function(){
    let chosenAnswer="none";
    let submitURL;
    $("#submitbutton").attr("disabled", true);
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

/*socket.on("connect", ()=> {
  socket.on("answercollection", ()=> {
    let chosenAnswer="none";
    let submitURL;
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
});*/

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
