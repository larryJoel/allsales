const fs = require("fs");
let data = require("../data/data.json");

function nuevo() {
  ultimo = data.ultimo += 1;
  ano = new Date().getFullYear();
  hoy = new Date().getDay();
  factura = "Fact" + ano + "-" + ultimo;
  let jsonData = {
    ultimo,
    hoy,
    factura,
  };
  let jsonDataString = JSON.stringify(jsonData);
  fs.writeFileSync("./src/data/data.json", jsonDataString);
}


module.exports = {
  nuevo
};
