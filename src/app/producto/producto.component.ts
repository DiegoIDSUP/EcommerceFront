import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { EcommerceService } from '../ecommerce.service';

@Component({
  selector: 'app-producto',
  templateUrl: './producto.component.html',
  styleUrls: ['./producto.component.css']
})
export class ProductoComponent implements OnInit {
  title
  producto
  comentarios
  report= false
  comentForm : FormGroup
  reporteForm : FormGroup
  user
  stock=1
  car
  constructor(public ecommerceService : EcommerceService, private cookies: CookieService, public  router:  Router,private route: ActivatedRoute,private _builder : FormBuilder) { 
    this.car
    let id =route.snapshot.paramMap.get('id')
    ecommerceService.getsearch("productos",id+"/").subscribe(response => {
      this.producto=response
      this.title=response.nombre
      ecommerceService.getsearch('comentarios3',"?producto="+response.id).subscribe(response => {
        if(response.length>0){
          this.comentarios=response
        }
      })
      if(this.producto.show){
        if(this.cookies.get("Token").length>0){
          ecommerceService.getauthsearch("usuarios","?email="+JSON.parse(this.cookies.get("Usuario")).email).subscribe(response => {
            this.user=response[0]
            for(let i=0;i<this.comentarios.length;i++){
              ecommerceService.getauthsearch('usuarios',this.comentarios[i].user+"/").subscribe(response => {
                this.comentarios[i]={...this.comentarios[i],'autor' : response.email}
              })
            }
              
          })
        }
        this.comentForm = this._builder.group({
          comentario : ['',Validators.required],
        })
        this.reporteForm = this._builder.group({
          comentario : ['',Validators.required],
        })
      }else{
        router.navigate(["/inicio"])
      }
    })
  }

  ngOnInit(): void {
  }
  Reportar(value){
    if(this.cookies.get("Token").length>0){
      if(JSON.parse(this.cookies.get("Usuario")).emailVerified){
        this.ecommerceService.postauth("reportes",{"user" : this.user.id ,"producto" : this.producto.id , "comentario" : value.comentario}).subscribe(response =>{
          this.report=false
          this.reporteForm = this._builder.group({
            comentario : ['',Validators.required],
          })
        })
      }else{
        alert("Necesitas autenticar tu cuenta para reportar un producto")
      }
    }else{
      alert("Necesitas estar registrado para reportar un producto")
      this.router.navigate(["/login"])
    }
  }
  
  publicarComentario(value){
    if(this.cookies.get("Token").length>0){
      if(JSON.parse(this.cookies.get("Usuario")).emailVerified){
        this.ecommerceService.postauth("comentarios",{"user" : this.user.id ,"producto" : this.producto.id , "comentario" : value.comentario}).subscribe(response =>{window.location.reload()})
      }else{
        alert("Necesitas ser un usuario autenticado para comentar un producto")
      }
    }else{
      alert("Necesitas estar registrado para hacer un comentario al producto")
      this.router.navigate(["/login"])
    }
  }
  
  addCar(){
    if(this.cookies.get("Token").length>0){
      let car = []
      if(this.cookies.get("Carrito").length>0){
        car = JSON.parse(this.cookies.get("Carrito"))
      }
      console.log(car)
      for(let product of car){  
        if(product.producto.id==this.producto.id){
          this.stock=this.stock + product.stock
          car.splice(car.indexOf(product),1)
        }
      }
      car.push({"producto" : this.producto,"stock":this.stock})
      this.cookies.set("Carrito",JSON.stringify(car))
      alert("Ahora tienes "+this.stock+" "+ this.producto.nombre + " en tu carrito")
      this.router.navigate(["/carrito"])
    }else{
      alert("Necesitas estar registrado para añadir productos a tu carrito")
      this.router.navigate(["/login"])
    }
    
  }
  stockChosen(value){
    if(value.target.value>this.producto.stock){
      value.target.value=this.producto.stock
    }
    this.stock=parseInt(value.target.value, 10)
  }
}
