const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Emprestimo = new Schema({
    codigo:{
        type: String,
        required: true
    },
    destino:{
        type: String,
        required: true
    },
    date:{
        type: Date,
        default: Date.now()
    }
})

mongoose.model('emprestimos', Emprestimo)