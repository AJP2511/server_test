const app = require('./app')
const mongoose = require('mongoose')
require('dotenv').config()


//parametros do servidor
const port = 3000
const host = 'localhost'
//mongoose
mongoose.connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
mongoose.connection
    .on('open', () => {
      console.log("Conexao com o banco de dados estabelecida")
    })
    .on('error', (err) => {
      console.log(`Houve um erro ao se conectar ao banco de dados ${err}`)
    })

const server = app.listen(port, host, () => {
    console.log(`Servidor aberto na url -> http://${host}:${port}`)
})