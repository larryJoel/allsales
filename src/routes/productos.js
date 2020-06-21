const express = require("express");
const router = express.Router();
const pool = require("../database");
const {isLoggedIn} = require('../lib/auth')

router.get("/add",isLoggedIn, async (req, res) => {
    // res.render("productos/add");
    const lista = await pool.query("SELECT id, name FROM categorias");
    res.render("productos/add", { lista });
    console.log(lista);
});


router.post("/add", isLoggedIn, async (req, res) => {
    const {
        cod_product,
        name,
        descripcion,
        inventario_min,
        inventario_max,
        precio_in,
        precio_out,
        unidad,
        unidad_compra,
        presentacion
    } = req.body;
    const newProduct = {
        cod_product,
        name,
        descripcion,
        inventario_min,
        inventario_max,
        precio_in,
        precio_out,
        unidad,
        unidad_compra,
        presentacion
    };
    await pool.query("INSERT INTO productos set ?", [newProduct]);
    res.redirect("/productos");
});

router.get('/',isLoggedIn , async(req,res)=>{
    const mostrar = await pool.query('SELECT * FROM productos');
    res.render("productos/list", {mostrar});
});

router.get('/delete/:id',isLoggedIn,async(req,res)=>{
    const { id } = req.params;
    await pool.query('DELETE FROM productos WHERE id = ?',[id]);
    res.redirect('/productos');
});

router.get("/edit",isLoggedIn, async (req, res) => {
    const lista = await pool.query("SELECT name FROM categorias");
    res.render("productos/edit", { lista });
});

router.get('/edit/:id', isLoggedIn,async(req,res)=>{
    const { id } = req.params;
    const links = await pool.query('SELECT * FROM productos WHERE id = ?', [id]); 
    res.render('productos/edit',{links:links[0]});
})

router.post('/edit/:id', isLoggedIn,async(req,res)=>{
    const { id } = req.params;
    console.log(id);
    const { cod_product,
        name,
        descripcion,
        inventario_min,
        inventario_max,
        precio_in,
        precio_out,
        unidad,
        unidad_compra,
        presentacion } = req.body;
    const editProducto = {
        cod_product,
        name,
        descripcion,
        inventario_min,
        inventario_max,
        precio_in,
        precio_out,
        unidad,
        unidad_compra,
        presentacion
    };
   
    await pool.query('UPDATE productos set ? WHERE id = ?',[editProducto,id]);
    res.redirect('/productos');
});

//entradas al inventario +++++++++++++++++++++++++++++++++++
router.get('/repo/:id', isLoggedIn,async(req,res)=>{
    const { id } = req.params;
    const links = await pool.query('SELECT * FROM productos WHERE id = ?', [id]); 
    res.render('productos/repo',{links:links[0]});
})

router.post('/repo/:id',isLoggedIn, async(req, res)=>{
    const { id } = req.params;
    const { cod_product, name, unidad, cant, proveedor, concepto} = req.body;
    const cargEntrada = {cod_product,name,unidad,cant,proveedor, concepto};
    await pool.query('INSERT INTO compras set ?',[cargEntrada]);
    await pool.query('UPDATE productos SET cantidad = cantidad + ? WHERE id = ?',[cargEntrada.cant, id]);
    res.redirect('/productos');
})
//salidas del inventario +++++++++++++++++++++++++++
router.get ('/salidas/:id',isLoggedIn,async(req,res)=>{
    const { id }= req.params;
    const links = await pool.query('SELECT * FROM productos WHERE id = ?',[id]);
    res.render('productos/salidas',{links:links[0]});
});


router.post('/salidas/:id',isLoggedIn,async(req,res)=>{
    const { id } = req.params;
    const {cod_product, name, unidad, cant, proveedor, concepto } = req.body;
    const cargSalida = {cod_product, name, unidad, cant, proveedor, concepto };
    await pool.query('INSERT INTO salidas set ?',[cargSalida]);
    await pool.query('UPDATE productos SET cantidad = cantidad - ? WHERE id = ?',[cargSalida.cant, id]);
    res.redirect('/productos');
});





module.exports = router;
