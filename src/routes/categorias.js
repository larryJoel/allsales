const express = require('express');
const router = express.Router();
const pool = require('../database');

//Rutas
router.get('/add',(req,res)=>{
    res.render('categorias/add');
});

router.post('/add',async(req,res)=>{
    const {name, descripcion} = req.body;
    const newCategoria = {
        name,
        descripcion
    };
    await pool.query('INSERT INTO categorias set ?',[newCategoria]);
    req.flash('success','Categoria guardada satisfactoriamente!');
    res.redirect('/categorias');
});

router.get('/', async(req,res)=>{
    const lista = await pool.query('SELECT * FROM categorias');
    res.render('categorias/list',{lista});
});

router.get('/delete/:id',async(req,res)=>{
    const { id } = req.params;
    await pool.query('DELETE FROM categorias WHERE ID = ?',[id]);
    req.flash('success','Categoria eliminada satisfactoriamente!');
    res.redirect('/categorias');
});

router.get('/edit/:id',async(req,res)=>{
    const { id } = req.params;
    const links = await pool.query('SELECT * FROM categorias WHERE id = ?',[id]);
    res.render('categorias/edit',{links:links[0]});
});

router.post('/edit/:id',async(req,res)=>{
    const { id } = req.params;
    const { name, descripcion } = req.body;
    const newCategoria = {
        name,
        descripcion
    };
    //contesole.log(newCategoria);
    await pool.query('UPDATE categorias set ? WHERE id = ?',[newCategoria, id]);
    req.flash('success','Categoria editada satisfactoriamente!');
    res.redirect('/categorias');
});




module.exports = router;