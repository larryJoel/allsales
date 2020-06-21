const express = require('express');
const router = express.Router();
const pool = require('../database')

router.get('/add', (req, res)=>{
    res.render('clientes/add');
});

router.post('/add',async(req, res)=>{
    const {fullname, username, documento,email,phone,address}= req.body;
    const newlink ={
        fullname,
        documento,
        username,
        email,
        phone,
        address
    };
    await pool.query('INSERT INTO clientes set ?',[newlink]);
    res.redirect('/clientes');
});

router.get('/', async(req, res)=>{
    const lista = await pool.query('SELECT * FROM clientes');
    res.render('clientes/list',{lista});
});

router.get('/delete/:id',async(req,res)=>{
    const { id }=req.params;
    await pool.query('DELETE FROM clientes WHERE ID = ?', [id]);
    res.redirect('/clientes');
});

router.get('/edit/:id', async(req,res)=>{
    const { id }= req.params;
    const links = await pool.query('SELECT * FROM clientes WHERE id = ?',[id]);
    res.render('clientes/edit',{links:links[0]} );
});

router.post('/edit/:id', async(req,res)=>{
    const { id } = req.params;
    const { fullname,username,documento,email,phone,address } = req.body;
    const newCliente ={
        fullname,
        documento,
        username,
        email,
        phone,
        address
    };
    //console.log(newCliente);
    await pool.query('UPDATE clientes set ? WHERE id = ?',[newCliente, id]);
    res.redirect('/clientes');
});


module.exports = router;