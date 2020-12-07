import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-carrito',
  templateUrl: './carrito.component.html',
  styleUrls: ['./carrito.component.css']
})
export class CarritoComponent implements OnInit {
  title = "Mi carrito"
  carrito
  fillcar=false
  total=0
  constructor(public cookies : CookieService, public  router:  Router) {
    if(cookies.get("Carrito").length > 0){
      this.fillcar=true
      this.carrito=JSON.parse(cookies.get("Carrito"))
      this.hacerCuenta()
    }
   }

  ngOnInit(): void {
  }

  hacerCuenta(){
    this.total=0
    for(let prod of this.carrito)
        this.total=this.total+(prod.producto.precio*prod.stock)
  }

  cambiarStock(event,value){
    if(event.target.value>value.producto.stock){
      event.target.value=value.producto.stock
    }
    let stock=parseInt(event.target.value, 10)
    this.carrito[this.carrito.indexOf(value)].stock=stock
    if(stock<=0){
      this.carrito.splice(this.carrito.indexOf(value),1)
    }
    this.cookies.set("Carrito",JSON.stringify(this.carrito))
    this.hacerCuenta()
  }
  eliminarProdcuto(value){
    let sure = confirm("¿Estas seguro que desea eliminar el producto "+value.producto.nombre+" de la lista de compra?")
    if(sure){
      console.log("Borrado")
      this.carrito.splice(this.carrito.indexOf(value),1)
      this.cookies.set("Carrito",JSON.stringify(this.carrito))
      this.hacerCuenta()
    }
  }
}
