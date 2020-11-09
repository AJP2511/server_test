const express = require('express')
const app = express()
const route = require('./routes/index')
const handlebars = require('express-handlebars')
const bodyParser = require('body-parser')
const path = require('path')
const session = require('express-session')
const flash = require('connect-flash')

//config sessao
    app.use(session({
        secret: "processengenharia",
        resave: true,
        saveUninitialized: true
    }))
    app.use(flash())
//middleware
    app.use((req,res,next) => {
        res.locals.success_msg = req.flash("success_msg")
        res.locals.error_msg = req.flash("error_msg")
        next()
    })
//config handlebars
    app.engine('handlebars',handlebars({ defaultLayout: 'main'}))
    app.set('view engine', 'handlebars')
//config bodyParser
    app.use(bodyParser.urlencoded({extended:true}))
    app.use(bodyParser.json())
//arquivos estaticos
    app.use(express.static(path.join(__dirname,'public')))

//rotas
    app.use('/admin', route)



module.exports = app