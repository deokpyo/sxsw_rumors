// Initialize Firebase
var config = {
    apiKey: "AIzaSyBaF7vfKfeIIOvzfcUb-tdq5TEVfEWSsfU",
    authDomain: "sxsw-rumors.firebaseapp.com",
    databaseURL: "https://sxsw-rumors.firebaseio.com",
    storageBucket: "sxsw-rumors.appspot.com",
    messagingSenderId: "1015580919458"
  };

firebase.initializeApp(config);

// Create a variable to reference the database
var database = firebase.database();

// Capture Button Click
$("#submit").on("click", function () {

  // Grabbed values from text boxes
  var input = $("#post-input").val();

  // Moment date
  var date = moment(new Date()).format("MMMM Do");

  // Code for handling the push
  database.ref().push({
    input: input,
    date: date,
    legit: 0,
    shit: 0
  });

  // Don't refresh the page!
  return false;
});

// database.ref().on("value", function (snapshot) {
//   var data = snapshot.val();
//   for(i in data){
//     console.log(data[i].legit);
//   }
// });

database.ref().orderByChild("legit").limitToLast(3).on("value", function (snapshot) {
  var data = snapshot.val();
  var key = snapshot.key;
  var div_all = $("<div>");
  var num = 3;


  for (i in data) {
    // Create divs
    var div_row = $("<div class='row'>");
    var div_s1 = $("<div class='col s1'>");
    var div_s11 = $("<div class='col s11'>");
    var div_s12 = $("<div class='col s12'>");

    // Date posted
    var h2 = $("<h2>");
    h2.text(data[i].date);
    div_s12.append(h2);

    // Post Number
    var h3 = $("<h3>");
    h3.text(num);
    div_s1.append(h3);

    // Post body
    var p = $("<p>");
    p.text(data[i].input);
    div_s11.append(p);

    // Legit count
    var legit = $("<h5 class='col s6 offset-s8'>");
    legit.text("Legit count: " + data[i].legit);
    div_s11.append(legit);

    // Append everything
    div_row.append(div_s12);
    div_row.append(div_s1);
    div_row.append(div_s11);

    // Prepend to html tag for descending order
    div_all.prepend(div_row);

    // Decrement
    num--;
  }

  $("#top-posts").html(div_all);

});

database.ref().on("child_added", function (snapshot) {
  // Data reference
  var key = snapshot.key;
  var data = snapshot.val();

  // Create a div with unique id key
  var div = $("<div class='row'>");
  div.attr("id", key);
  // Create divs
  var div_s12 = $("<div class='col s12'>");
  var div_s6 = $("<div class='col s6 offset-s8'>");

  // Date posted
  var h2 = $("<h2>");
  h2.text(data.date);
  div_s12.append(h2);

  // Post body
  var p = $("<p>");
  p.text(data.input);
  div_s12.append(p);

  // Buttons
  var btn_legit = $("<button class='btn-legit'>LEGIT</button>");
  var btn_shit = $("<button class='btn-shit'>SHIT</button>");
  btn_legit.attr("data-key", key);
  btn_shit.attr("data-key", key);
  div_s6.append(btn_legit);
  div_s6.append(btn_shit);

  // Append everything
  div.append(div_s12);
  div.append(div_s6);

  // Append to html tag
  $("#recent-posts").append(div);

  // Handle the errors
}, function (errorObject) {
  console.log("Errors handled: " + errorObject.code);
});

// Capture Legit Button Click
$(document.body).on("click", ".btn-legit", function () {
  var key = $(this).attr("data-key");
  $("#" + key).find("button").attr("disabled", true);
  return database.ref(key).once("value").then(function (snapshot) {
    console.log(snapshot.val().legit);
    var legit = snapshot.val().legit;
    legit++;
    database.ref(key).update({ legit: legit });
  });
});

// Capture Shit Button Click
$(document.body).on("click", ".btn-shit", function () {
  var key = $(this).attr("data-key");
  $("#" + key).find("button").attr("disabled", true);
  return database.ref(key).once("value").then(function (snapshot) {
    console.log(snapshot.val().shit);
    var shit = snapshot.val().shit;
    shit++;
    database.ref(key).update({ shit: shit });
  });

});





