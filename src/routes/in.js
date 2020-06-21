const express = require("express");
const router = express.Router();
const pool = require("../database");
const {isLoggedIn} = require('../lib/auth')

router.get('/',isLoggedIn, async(req,res)=>{
    const mostrar = await pool.query('SELECT * FROM compras')
    res.render('in/list',{mostrar});
});

// router.get('/delete/:id,cant',isLoggedIn,async(req,res)=>{
//     const { cant, id } = req.params;
//     await pool.query('DELETE FROM compras WHERE id = ?',[id]);
//     await pool.query('UPDATE productos SET cantidad = cantidad - ? WHERE id = ?',[ cant,id]);
//     res.redirect('/in');
// });

module.exports = router;