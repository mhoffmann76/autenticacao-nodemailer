const express = require("express");
const nodemailer = require("nodemailer");

const router = express.Router();

let email = "";
let mensagem = "";
let login = "admin";
let password = "1234";


router.get("/", (req, res) => {
  if (req.session.login) {
    res.render("sendmail", { email: "", mensagem: "" });
    console.log("Usuário logado" + req.session.login);
  } else {
    res.render("index", { mensagem, email: "" });
  }
});

router.post("/", (req, res) => {
  if (req.body.password == password && req.body.login == login) {
    req.session.login = login;
    res.render("sendmail", { email, mensagem: "" });
  } else {
    mensagem = "Verifique o usuário e a senha";
    res.render("index", { mensagem });
  }
});

router.post("/send", (req, res) => {
  email = "";
  mensagem = "";

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

module.exports = router;
