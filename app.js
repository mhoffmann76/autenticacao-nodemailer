const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const path = require("path");
const rotas = require("./src/routes/rotas");

const app = express();

app.use(express.static(__dirname + "/public"));
app.use(session({ secret: "12134567890" }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded({ extend: true }));

app.set("view engine", "ejs");


app.use(rotas);

app.use("", (req, res) => {
  res.send("Pagina não localizada");
});

app.listen(8080, () => {
  console.log("server listening on port 8080");
});
