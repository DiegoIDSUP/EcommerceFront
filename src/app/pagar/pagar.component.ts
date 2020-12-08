import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { EcommerceService } from '../ecommerce.service';
import { OpenpayService } from '../openpay.service';

@Component({
  selector: 'app-pagar',
  templateUrl: './pagar.component.html',
  styleUrls: ['./pagar.component.css']
})
export class PagarComponent implements OnInit {

  title="Proceder con el Pago"
  cardtype=""
  carrito
  total
  domicilios
  dom
  cardForm : FormGroup
  domicilioForm : FormGroup
  domform=false
  filld=false
  domselect=false
  user
  userbd
  msndom
  constructor(public ecommerceService : EcommerceService, public openpayService : OpenpayService,public cookies : CookieService, public  router:  Router, private _builder : FormBuilder) {
    this.user=JSON.parse(this.cookies.get("Usuario"))
    ecommerceService.getauthsearch("usuarios","?email="+this.user.email).subscribe(response => {
      this.userbd=response[0]
      ecommerceService.getauthsearch("domicilios","?user="+this.userbd.id).subscribe(response => {
        if(response.length>0){
          this.domicilios=response
        }
      })
    })
    if(cookies.get("Carrito").length > 0){
      this.carrito=JSON.parse(cookies.get("Carrito"))
      this.hacerCuenta()
    }
    this.cardForm = this._builder.group({
      name : ['',Validators.required],
      card : ['',Validators.compose([Validators.required, Validators.pattern(/^-?(0|[1-9]\d*)?\S{14,16}$/)])],
      year : ['',Validators.compose([Validators.required, Validators.pattern(/^-?(0|[1-9]\d*)?\S{1,2}$/)])],
      month : ['',Validators.compose([Validators.required, Validators.pattern(/^-?(0|[1-9]\d*)?\S{1,2}$/)])],
      cvv2 : ['',Validators.compose([Validators.required, Validators.pattern(/^-?(0|[1-9]\d*)?\S{3,4}$/)])],
    })
  }

  ngOnInit(): void {
  }
  choseDom(value){
    this.dom=value
    this.domselect=true
  }
  hacerCuenta(){
    this.total=0
    for(let prod of this.carrito)
        this.total=this.total+(prod.producto.precio*prod.stock)
  }
  generateCharge(value){
    if(value.month>12){
      value.month=12
    }if(value.month<1){
      value.month=1
    }
    if(this.domselect){
      var createToken = {
        "card_number": value.card,
        "holder_name": value.name,
        "expiration_year": value.year,
        "expiration_month": value.month,
        "cvv2": value.cvv2,
        "address":{
          "city":this.dom.ciudad,
          "line3":this.dom.estado,
          "postal_code":this.dom.cp,
          "line1":this.dom.ciudad,
          "line2":this.dom.num,
          "state":this.dom.estado,
          "country_code":"MX"
       }
      };
      var newCharge = {
        
        "source_id" : "",
        "method" : "card",
        "amount" : this.total,
        "currency" : "MXN",
        "description" : "Compra de ropa en Ropa Artesanal",
        "device_session_id" : "",
        "customer" : {
          "name" : "Diego Antonio",
          "last_name" : "Figueroa Guzman",
          "email" : "153241@ids.upchiapas.edu.mx"
        }
      };
      this.openpayService.CreateCharge(createToken,newCharge,this.dom)
    }else{
      alert("Selecciona una direccion")
    }
  }
  
  addDomicilio(){
    this.msndom="Crear Domicilio"
    this.domform=true
    this.filld=false
    this.domicilioForm = this._builder.group({
      user : [this.userbd.id,],
      calle : ['', Validators.required],
      num : ['', Validators.required],
      numInt : ['',],
      referencia : ['',],
      colonia : ['', Validators.required],
      cp : ['', Validators.required],
      ciudad : ['', Validators.required],
      estado : ['', Validators.required],
    })
  }
  editarDom(value){
    this.msndom="Editar Domicilio"
    this.domform=true
    this.filld=true
    this.domicilioForm = this._builder.group({
      id : [value.id,],
      user : [this.userbd.id,],
      calle : [value.calle, Validators.required],
      num : [value.num, Validators.required],
      numInt : [value.numInt,],
      referencia : [value.referencia,],
      colonia : [value.colonia, Validators.required],
      cp : [value.cp, Validators.required],
      ciudad : [value.ciudad, Validators.required],
      estado : [value.estado, Validators.required],
    })
  }
  CrearDomicilio(value){
    if(this.filld){
      let id=value.id
      delete value['id']
      this.ecommerceService.updateauth("domicilios",id,value).subscribe(response => { window.location.reload() })
    }else{
      this.ecommerceService.postauth("domicilios",value).subscribe(response => { window.location.reload() })
    }
    
  }
  eliminarDomicilio(value){
    let sure=confirm("Seguro que desea borrar el domicilio "+value.calle+" #"+value.num+" de la colonia "+value.colonia+" ubicado en "+value.ciudad+", "+value.estado)
    if(sure){
      this.ecommerceService.delete("domicilios",value.id).subscribe(response => {window.location.reload() })
    }
  }
  deleteProd(value){
    let sure=confirm("Seguro que desea borrar el producto "+value.nombre)
    if(sure){
      this.ecommerceService.delete("productos",value.id).subscribe(response => {window.location.reload() })
    }
  }
  verMes(input){
    if(input.target.value>12){
      input.target.value=12
    }
  }
  defineCard(event){
    this.cardtype =this.openpayService.typeCard(event.target.value)
  }
}
