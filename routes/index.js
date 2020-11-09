const express = require('express')
const mongoose = require('mongoose')
const router = express.Router()
require('../models/Categoria')
const Categoria = mongoose.model('categorias')
require('../models/Postagem')
const Postagem = mongoose.model('postagens')
require('../models/Emprestimo')
const Emprestimo = mongoose.model('emprestimos')

//CATEGORIAS

router.get('/', (req,res) => {

    Postagem.find().lean().then((postagem) => {
      Categoria.find().lean().then((categoria) => {
            res.render('admin/index', {postagem: postagem, categoria: categoria})
      }).catch((err) => {
        req.flash("error_msg","Houve um erro ao carregar as tabelas")
        res.redirect('/admin/sensores')
      })
    }).catch((err) => {
      req.flash("error_msg","houve um erro ao carregar as tabelas")
      res.redirect("/admin/sensores")
    })    
})

router.get('/categorias', (req,res) => {
    Categoria.find().lean().sort({date:'desc'}).then((data) => {
        res.render('admin/categorias',{categorias:data})
    }).catch((err) => {
      req.flash('error_msg', "houve um erro ao listas as categorias")
      res.redirect('/admin')
    })
   
})

router.get('/categorias/add', (req,res) => {
    res.render('admin/addCategorias')
})

router.post('/categorias/nova', (req,res) => {

    var erros = []

    if (!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null){
        erros.push({text:"nome invalido"})
    }
    if (!req.body.slug || typeof req.body.slug == undefined || req.body.slug == null){
        erros.push({text:"slug invalido"})
    }
    if (erros.length > 0){
        res.render("admin/addCategorias", {erros: erros})
    }else{ 
        const novaCategoria = {
            nome: req.body.nome,
            slug: req.body.slug
        }
        new Categoria(novaCategoria).save().then( () => {
          req.flash("success_msg","Categoria criada com sucesso")
          res.redirect('/admin/categorias')
        }).catch( (err) => {
          req.flash("error_msg","Houve um erro ao salvar a categoria, tente novamente")
          res.redirect('/admin')
        })
    }   
})

router.get('/categorias/edit/:id', (req,res) => {
    Categoria.findOne({_id:req.params.id}).lean().then((data) => {
        res.render('admin/editCategorias', {categoria : data})
    }).catch((err) => {
        req.flash("error_msg", "Esta categoria não existe")
        res.redirect('/admin/categorias')
    })
    
})

router.post('/categorias/edit', (req,res) => {
    Categoria.findOne({_id: req.body.id}).then((data) => {
        data.nome = req.body.nome
        data.slug = req.body.slug

        data.save().then(() => {
          req.flash("success_msg","Categoria alterada com sucesso")
          res.redirect('/admin/categorias')
        }).catch((err) => {
          req.flash("error_msg","Houve um erro interno ao editar a categoria")
          res.redirect('/admin/categorias')
        })
    }).catch((err) => {
      req.flash("error_msg","houve um erro ao editar a categoria")
      res.redirect("/admin/categorias")
    })
})

router.post('/categorias/deletar', (req,res) => {
    Categoria.deleteOne({_id:req.body.id}).then(() => {
        req.flash("success_msg","Categoria deletada com sucesso")
        res.redirect('/admin/categorias')
    }).catch((err) => {
        req.flash("error_msg","Houve um erro ao deletar sua categoria")
        res.redirect('/admin/categorias')
    })
})

// SENSORES

router.get('/sensores', (req,res) => {
    Postagem.find().lean().populate("categoria").sort({data:"desc"}).then((data) => {
        res.render('admin/sensores', {postagens: data})
    }).catch((err) => {
      req.flash("erros_msg","Houve um erro ao carregar os sensores")
      res.redirect("/admin")
    })
    
})

router.get('/sensores/add', (req,res) => {
    Categoria.find().lean().then( (data) => {
        res.render('admin/addSensores', {categorias: data})
    }).catch((err) => {
      req.flash("error_msg","Houve um ero ao carregar sua categoria")
      res.redirect('/admin')
    })
})

router.post('/sensores/nova', (req,res) => {
    var erros = []

    if(req.body.categoria == "0"){
        erros.push({text: "Categoria inválida, registre uma categoria"})
    }

    if (erros.length > 0){
        res.render('admin/addSensores', {erros: erros})
    }else{
        const novoSensor = {
            nome_equipamento : req.body.nome_equipamento,
            marca: req.body.marca,
            estado: req.body.estado,
            quantidade: req.body.quantidade,
            categoria: req.body.categoria
        }
        new Postagem(novoSensor).save().then( () => {
          req.flash("success_msg","Sensor criado com sucesso")
          res.redirect('/admin/sensores')
        }).catch((err) => {
          req.flash("error_msg","Houve um erro durando o salvamento do sensor")
          res.redirect("/admin/sensores")
        })
    }
})

router.get('/sensores/edit/:id', (req,res) => {

    Postagem.findOne({_id: req.params.id}).lean().then((data) => {
        
        Categoria.find().lean().then((categoria) => {
            res.render("admin/editSensor",{categorias:categoria, data:data})
        }).catch((err) => {
            req.flash("error_msg","Houve um erro ao listar as categorias")
            res.redirect("/admin/sensores")
        })
    }).catch((err) => {
        req.flash("error_msg","Houve um erro ao carregar o formulário de edição")
        res.redirect("/admin/sensores")
    })  
})

router.post('/sensores/edit', (req,res) => {
    
    Postagem.findOne({_id: req.body.id}).then((data) => {
      
          data.nome_equipamento = req.body.nome_equipamento,
          data.marca = req.body.marca,
          data.estado = req.body.estado,
          data.quantidade = req.body.quantidade,
          data.categoria = req.body.categoria

            data.save().then(() => {
              req.flash("success_msg","Sensor editado com sucesso!")
              res.redirect("/admin/sensores")
            }).catch((err) => {
              req.flash("error_msg", "Erro interno")
              res.redirect("/admin/sensores")
            })
    }).catch((err) => {
        console.log(err)
      req.flash("error_msg","Houve um erro ao salvar a edição")
      res.redirect("/admin/sensores")
    })
})

router.post('/sensores/deletar', (req,res) => {
    Postagem.deleteOne({_id: req.body.id}).then(() => {
      req.flash("success_msg","Sensor deletado com sucesso!")
      res.redirect("/admin/sensores")
    }).catch((err) => {
      req.flash("error_msg","Erro ao deletar o sensor!")
      res.redirect("/admin/sensores")
    })
})

//EMPRESTIMOS

router.get('/emprestimo', (req,res) => {
    Emprestimo.find().lean().sort({date:'desc'}).then((data) => {
        res.render('admin/emprestimo', {categorias: data})
    }).catch((err) => {
        req.flash("error_msg","Houve um erro ao carregar seus emprestimos")
        res.redirect('/admin')
    })
})

router.get('/emprestimo/add', (req,res) => {
    res.render('admin/addEmprestimo')
})

router.post('/emprestimo/nova', (req,res) => {

    var erros = []

    if(req.body.codigo == null){
      erros.push({text:"nome vazio"})
    }
    if(req.body.destino == null){
      erros.push({text:"destino vazio"})
    }
    if(erros.length > 0){
      res.render("admin/addEmprestimo", {erros:erros})
    }else{
      const novoEmprestimo = {
        codigo: req.body.codigo,
        destino: req.body.destino
      }

      new Emprestimo(novoEmprestimo).save().then(() => {
        req.flash("success_msg","Destino cadastrado com sucesso!")
        res.redirect('/admin/emprestimo')
      }).catch((err) => {
        req.flash("error_msg","Houve um erro ao cadastrar o empréstimo!")
        res.redirect("/admin/emprestimo")
      })
    }
})

router.get('/emprestimo/edit/:id', (req,res) => {
    Emprestimo.findOne({_id:req.params.id}).lean().then((data) => {
        res.render('admin/editEmprestimo', {categorias:data})
    }).catch((err) => {
        req.flash("error_msg","Erro!")
        res.redirect("/admin/emprestimo")
    })
})

router.post('/emprestimo/edit', (req,res) => {
    Emprestimo.findOne({_id: req.body.id}).then((data) => {
      data.codigo = req.body.codigo
      data.destino = req.body.destino

      data.save().then(() => {
        req.flash("success_msg","Empréstimo salvo com sucesso!")
        res.redirect("/admin/emprestimo")
      }).catch((err) => {
          req.flash("error_msg","Houve um erro ao editar seu empréstimo!")
          res.redirect("/admin/emprestimo")
      })
    }).catch((err) => {
        req.flash("error_msg","Houve um erro ao editar seu empréstimo!")
        res.redirect("/admin/emprestimo")
    })
})

router.post('/emprestimo/deletar', (req,res) => {
  Emprestimo.deleteOne({_id:req.body.id}).then(() => {
      req.flash("success_msg","Empréstimo deletado com sucesso")
      res.redirect('/admin/emprestimo')
  }).catch((err) => {
      req.flash("error_msg","Houve um erro ao deletar seu empréstimo")
      res.redirect('/admin/esmprestimo')
  })
})
module.exports = router