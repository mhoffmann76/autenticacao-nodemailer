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

let email = "";
let mensagem = "";

app.get("/", (req, res) => {
  if (req.session.login) {
    res.render("sendmail", { email: "", mensagem: "" });

    console.log("Usuário logado" + req.session.login);
  } else {
    res.render("index", { mensagem, email: "" });
  }
});

app.post("/", (req, res) => {
  if (req.body.password == password && req.body.login == login) {
    req.session.login = login;

    res.render("sendmail", { email, mensagem: "" });
  } else {
    mensagem = "Verifique o usuário e a senha";
    res.render("index", { mensagem });
  }
});

app.post("/send", (req, res) => {
  if (req.body.subject == "" || req.body.conteudo == "") {
    mensagem = "Favor Prencher os campos";
    res.render("sendmail", { mensagem, email: "" });
  } else {
    const transport = nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: "ec08f6f91806ed",
        pass: "8236c6b9b3fcb1",
        //user: "0eb4a8abc5e910",
        //pass: "c3bf02ce6b9598",
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
        res.render("sendmail", { email, mensagem: "" });
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
