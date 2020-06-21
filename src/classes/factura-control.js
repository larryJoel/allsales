const fs = require("fs");

class FacturaControl {
  constructor() {
    this.ultimo = 0;
    this.hoy = new Date().getDate();
    this.mes = new Date().getMonth();
    this.ano = new Date().getFullYear();
    this.factura = "Fact"+this.ano + "-" + this.ultimo;
    let data = require("../data/data.json");
      
    // console.log(data);
    if (data.hoy === this.hoy) {
      this.ultimo = data.ultimo;
      this.factura = data.factura;
    } else {
      this.reiniciarConteo();
    }
  }

  siguiente() {
    this.ultimo = this.ultimo += 1;
    this.factura = "Fact-"+this.ano + "-" + this.ultimo;
    this.grabarArchivo();
    return `factura ${this.factura}`
  }

  reiniciarConteo() {
    this.ultimo = 0;
    this.factura = "Fact-"+this.ano + "-" + this.ultimo;
    console.log("Se ha inicializado la factura!");
    this.grabarArchivo();
  }

  grabarArchivo() {
    let jsonData = {
      ultimo: this.ultimo,
      hoy: this.hoy,
      factura:this.factura
    };
    let jsonDataString = JSON.stringify(jsonData);
    fs.writeFileSync("./src/data/data.json", jsonDataString);
  }
}

module.exports = {
  FacturaControl,
};
