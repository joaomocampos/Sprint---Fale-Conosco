const express = require("express");
const cors = require("cors");
const mysql = require("mysql2/promise");
const porta = 3000;
const app = express();
const pool = require("./db.js");
app.use(cors());
//consegue acessar os dados do body
app.use(express.json());
app.listen(porta, () => {
  console.log("Servidor Rodando");
});

app.post("/mensagem", async (req, res) => {
  try {
    const {
      nome,
      email,
      assunto,
      mensagem,
    } = req.body;
    if (nome == "") {
      return res.json({ resposta: "Preencha seu nome completo" });
    } else if (nome.length < 6) {
      return res.json({
        resposta: "O nome completo tem que conter no minimo 6 caracteres",
      });
    } else if (email.length < 6) {
      return res.json({
        resposta: "O email tem que conter no minimo 6 caracteres",
      });
    } else if (assunto.length < 6) {
      return res.json({
        resposta: "O assunto deve conter no minimo 6 caracteres",
      });
    }
    

    sql = `insert into visitantes (nome,email,assunto,mensagem) values (?,?,?,?)`;
    let [resultado2] = await pool.query(sql, [
      nome,
      email,
      assunto,
      mensagem,
    ]);
    if (resultado2.affectedRows == 1) {
      res.json({ resposta: "Sua mensagem foi enviada com sucesso" });
    } else {
      res.json({ resposta: "Erro ao enviar a mensagem!" });
    }
  } catch (error) {
    console.log(error);
  }
});

