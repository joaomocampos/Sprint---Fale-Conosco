const express = require("express");
const mysql = require("mysql2/promise");
const cors = require("cors");
const bcrypt = require("bcrypt");

const app = express();
app.use(express.json());
app.use(cors());

const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "banco_projeto",
});

const SALT_ROUNDS = 12;

app.post("/registrar", async (req, res) => {
    try {
      const { email, senha, telefone, cpf } = req.body;
  
      if (!email || !senha) {
        return res.status(400).json({ error: "Email e senha são obrigatórios." });
      }
  
      const hash = await bcrypt.hash(senha, SALT_ROUNDS);
  
      // tabela LOGIN
      const sql = `
          INSERT INTO login (email, senha, telefone, cpf)
          VALUES (?, ?, ?, ?)
      `;
  
      await db.query(sql, [email, hash, telefone, cpf]);
  
      res.json({ message: "Usuário registrado com sucesso!" });
    } catch (err) {
      console.error(err);
  
      if (err.code === "ER_DUP_ENTRY") {
        return res.status(400).json({ error: "E-mail já cadastrado." });
      }
  
      res.status(500).json({ error: "Erro no servidor." });
    }
  });
  
app.listen(3000, () => {
  console.log("Server ON: http://localhost:3000");
});
