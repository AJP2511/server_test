const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Postagem = new Schema({
    nome_equipamento:{
        type: String,
        required: true
    },
    marca:{
        type: String,
        required: true
    },
    estado:{
        type: String,
        required: true
    },
    quantidade:{
        type: Number,
        required: true
    },
    categoria:{
        type: Schema.Types.ObjectId,
        ref: "categorias",
        required: true
    },
    date:{
        type: Date,
        default: Date.now()
    }
})

mongoose.model('postagens', Postagem)