const express = require('express')
const cors = require('cors')
const mysql = require('mysql2/promise')
const porta = 3000
const app = express()
const pool = require('./db.js')
//módulo crypto
const crypto = require('crypto')

app.use(cors())
//consegue acessar os dados do body
app.use(express.json())

//Criando uma rota
app.get("/hash",async (req,res)=>{
    try {
        let {senha_usuario} = req.body

        senha_usuario = senha_usuario.trim()
        senha_usuario = senha_usuario.replace("","")

        if(senha_usuario==""){
            return res.send("Preencha uma senha")
        }else if(senha_usuario.length <6){
            return res.send("A senha tem que conter no minimo 6 caracteres")
        }

        const hash = crypto.createHash("sha256").update(senha_usuario).digest("hex")
        res.send(`A senha enviada é: ${hash}`)

    } catch (error) {
        console.log(error)
    }
})

app.post("/cadastrarcliente",async(req,res)=>{
    try {
        const {nome_completo,email,caminho_foto,rua,bairro,cidade,uf,numero_casa,data_nascimento} = req.body
        let {senha} = req.body

        senha = senha.trim()
        senha = senha.replace("","")

        if(senha==""){
            return res.send("Preencha uma senha")
        }else if(senha.length <6){
            return res.send("A senha tem que conter no minimo 6 caracteres")
        }

        let sql = `select * from usuarios where email = ?`
        let [resultado] = await pool.query(sql,[email])
        if (resultado.length != 0){
            return res.json({"resposta":"Email já cadastrado"})
        }

        const hash = crypto.createHash("sha256").update(senha).digest("hex")
        
        sql = `insert into usuarios (nome_completo,email,senha,caminho_foto) values (?,?,?,?)`
        let [resultado2] = await pool.query(sql,[nome_completo,email,hash,caminho_foto])
        if(resultado2.affectedRows == 1){
            res.json({"resposta":"Cadastro efetuado com sucesso!"})
        }else{
            res.json({"resposta":"Erro ao fazer cadastro!"})
        }
    } catch (error) {
        console.log(error)
    }
})