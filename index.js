const express = require("express");

const session = require("express-session");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const path = require("path");

const app = express();

app.use(express.static(__dirname + "/public"));
app.use(session({ secret: "12134567890" }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded({ extend: true }));

app.set("view engine", "ejs");

let login = "admin";
let password = "1234";

var email = "";
var mensagem = "";

app.get("/", (req, res) => {
  email = "";
  mensagem = "";

  if (req.session.login) {
    mensagem = "";
    res.render("sendmail");

    console.log("Usuário logado" + req.session.login);
  } else {
    res.render("index", {mensagem});
  }
});

app.post("/", (req, res) => {
  mensagem = "";
  if (req.body.password == password && req.body.login == login) {
    req.session.login = login;

    res.render("sendmail", { email });
  } else {
    mensagem = "Verifique o usuário e a senha"
    res.render("index", {mensagem });
  }
});

app.post("/send", (req, res) => {
  email = "";
  mensagem = "";

  if (req.body.subject == "" || req.body.conteudo == "") {
    email = "Favor Prencher os campos";
    res.render("sendmail", { email });
  } else {
    const transport = nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: "ec08f6f91806ed",
        pass: "8236c6b9b3fcb1",
      },
    });

    transport
      .sendMail({
        from: "sender@server.com",
        to: "receiver@sender.com",
        subject: req.body.subject,
        text: req.body.conteudo,
      })
      .then((info) => {
        email = "Mensagem enviada com sucesso!";
        res.render("sendmail", { email });
      })
      .catch((error) => {
        debug(error);
        res.send(error);
      });
  }
});

app.use("", (req, res) => {
  res.send("Pagina não localizada");
});

app.listen(443, () => {
  console.log("listening on port 443");
});
