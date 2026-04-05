let express = require("express");

let app = express();


app.set("view engine", "ejs");


app.use(express.static("public"));

app.get("/", function (req, res) {

  return res.render("homepage");
});


app.get("/sale", function (req, res) {

  return res.render("sale");
});

app.get("/readyToWear", function (req, res) {

  return res.render("readyToWear");
});

app.get("/nowHappening", function (req, res) {

  return res.render("nowHappening");
});

app.get("/newIN", function (req, res) {

  return res.render("newIN");
});

app.get("/fromRamadanToEid", function (req, res) {

  return res.render("fromRamadanToEid");
});

app.get("/fragrances", function (req, res) {

  return res.render("fragrances");
});

app.get("/fabrics", function (req, res) {

  return res.render("Fabrics");
});

app.listen(3000, function () {
  console.log("Server is running on port 3000");
});