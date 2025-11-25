//Meu arquivo conexão com o banco de Dados
const mysql = require('mysql2/promise')

//pool de conexão

const pool = mysql.createPool({
    //criar configurações com o BD
    host:"localhost",
    //host é o endereço do BD
    user:"root",
    password:"",
    port:3306,
    database:"banco_projeto",
    waitForConnections:true,
    connectionLimit:10,
    queueLimit:0
})

module.exports = pool