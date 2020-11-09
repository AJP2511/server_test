const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Emprestimo = new Schema({
    equipamento_emprestado:{
        type: String,
        required: true
    },
    para_quem:{
        type: String,
        required: true
    },
    date:{
        type: Date,
        default: Date.now()
    }
})

mongoose.model('emprestimos', Categoria)