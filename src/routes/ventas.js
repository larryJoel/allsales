const express = require("express");
const router = express.Router();
const { isLoggedIn } = require("../lib/auth");
const pool = require("../database");
const fs = require("fs");
const { nuevo } = require("../classes/nueva-factura");

router.get("/",isLoggedIn, async(req, res) => {
  const ventas = await pool.query("SELECT * FROM factura")
  res.render("ventas/list",{ ventas });
});

router.get("/list",(req, res) => {
  nuevo();
  res.render("ventas/fact", { ultimo });
});

router.post('/list',isLoggedIn,async(req,res)=>{
  const{ numero_fact,id_cliente, documento,monto_total} = req.body;
  const cabecera = await pool.query('INSERT INTO factura SET ?',{
    numero_fact:numero_fact,
    id_cliente:id_cliente,
    documento:documento,
    monto_total:monto_total
  })
  res.redirect('/ventas');
});

router.get("/fact", isLoggedIn, async (req, res) => {
  let fact = require("../data/data.json");
  factura = fact.ultimo;
  const detalle = await pool.query("SELECT * FROM detalle WHERE num_fact = ?", [
    factura,
  ]);

  const total = await pool.query(
    "SELECT sum(detalle.total)as tot FROM `detalle` WHERE detalle.num_fact = ?",
    [factura]
  );
  // console.log(total[0].tot);
  row = total[0].tot;

  res.render("ventas/fact", { factura, detalle, row });
});

router.get("/add", async (req, res) => {
  res.render("ventas/add");
});

router.post("/add", async (req, res) => {
  const { id } = req.body;
  const buscador = await pool.query("SELECT * FROM productos WHERE id=?", [id]);
  res.render("ventas/fact", { buscador: buscador[0] });
});

router.post("/fact", isLoggedIn, async (req, res) => {
  const { id_producto, descripcion, cantidad, precio } = req.body;
  let data = require("../data/data.json");
  // console.log("esto es lo que encuentra para grabar", data);
  let fact = data.ultimo;
  await pool.query("INSERT INTO detalle SET?", {
    id_producto: id_producto,
    descripcion: descripcion,
    cantidad: cantidad,
    precio: precio,
    total: precio * cantidad,
    num_fact: fact,
  });
  res.redirect("/ventas/fact");
});

router.get("/cabecera", isLoggedIn, async (req, res) => {

  res.render("ventas/cabecera");
});

router.post("/cabecera", isLoggedIn, async (req, res) => {
  const { documento } = req.body;
  const cliente = await pool.query(
    "SELECT * FROM clientes WHERE documento =?",
    [documento]
  );
  try {
    nombre_cliente = cliente[0].fullname;
    id_cliente = cliente[0].id;
    documento_cliente = cliente[0].documento;
    console.log(nombre_cliente, id_cliente, documento_cliente);

    let fact = require("../data/data.json");
    const total = await pool.query(
      "SELECT sum(detalle.total)as tot FROM `detalle` WHERE detalle.num_fact = ?",
      [fact.ultimo]
    );
    factura = fact.ultimo;
    venta = total[0].tot;
    res.render("ventas/cabecera", { nombre_cliente, documento_cliente,factura,id_cliente,venta });
  } 
  catch (e) {
    req.flash("message", "No se encontro el cliente!"); //mejorar el codigo
    res.render('ventas/cabecera')
  }
});

router.get('/delete/:numero_fact', isLoggedIn,async(req, res)=>{
  const num = req.params;
  console.log(num.numero_fact);
  await pool.query('DELETE FROM factura WHERE numero_fact = ?',[num.numero_fact]);
  await pool.query('DELETE FROM detalle WHERE num_fact = ?',[num.numero_fact]);
  res.redirect('/ventas');
});

router.get('/mostrar/:numero_fact', isLoggedIn,async(req, res)=>{
  const fact = req.params;
  const cabecera = await pool.query('SELECT * FROM factura WHERE numero_fact = ?',[fact.numero_fact]);
  const detalle = await pool.query('SELECT * FROM detalle WHERE num_fact =?',[fact.numero_fact]);
  const cabeza=detalle[0];
  console.log(cabeza);
console.log(cabeza.total)
  res.render("ventas/invoice",{fact, detalle, cabecera:cabecera[0]})
  });

// router.post("/cabecera", isLoggedIn, async (req, res) => {
//   const { numero_fact, documento } = req.body;
//   const fact = await pool.query("INSERT INTO factura SET ?", {
//     numero_fact: numero_fact,
//     documento: documento,
//   });
//   // res.redirect('/ventas/cabecera')***********************}
//   factura = num_fact;
//   res.render("ventas/fact", { factura });
// });

module.exports = router;
