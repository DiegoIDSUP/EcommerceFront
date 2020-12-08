import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { environment } from '../environments/environment';
import { EcommerceService } from './ecommerce.service';

declare var OpenPay: any;
var charge
var ecommerceService
var cookies
var Domicilio
var route

@Injectable({
  providedIn: 'root'
})
export class OpenpayService {
  constructor(public eService : EcommerceService, private cookie: CookieService, public  router:  Router) {
    ecommerceService = eService;
    cookies = cookie
    route=router
    OpenPay.setId(environment.OpenPay.merchant_id);
    OpenPay.setApiKey(environment.OpenPay.public_key);
    OpenPay.setSandboxMode(true);
  }

  public onSuccess(response){
    charge.source_id=response.data.id
    ecommerceService.postcharges(charge).subscribe(response => {
      let productos=JSON.parse(cookies.get("Carrito"))
      for(let producto of productos){
        let pedido={
          'user': producto.producto.user,
          'producto': producto.producto.id,
          'domicilio' : Domicilio.id,
          'id_transaction' : response.id,
          'stock' : producto.stock,
          'release_date' : new Date()
        }
        producto.producto.stock=producto.producto.stock-producto.stock
        ecommerceService.postauth("pedidos",pedido).subscribe(response => {console.log(response)})
        ecommerceService.update("productos",producto.producto.id,{'stock':producto.producto.stock}).subscribe(response => { })
      }
      cookies.set("Carrito","")
      route.navigate(['/inicio'])
      alert("Su compra ha sido Exitosa")
    })
  }
  onError(response) {
    alert('Fallo en la transacción');
    console.log(response)
  }
  CreateCharge(Cardinfo,Chargeinfo,domicilio){
    if(OpenPay.card.validateCardNumber(Cardinfo.card_number) && OpenPay.card.validateCVC(Cardinfo.cvv2) && OpenPay.card.validateExpiry(Cardinfo.expiration_month, Cardinfo.expiration_year)){
      Chargeinfo.device_session_id=OpenPay.deviceData.setup("formId")
      charge=Chargeinfo
      Domicilio=domicilio
      OpenPay.token.create(Cardinfo, this.onSuccess, this.onError)
    }else{
      alert("Su tarjeta a sido denegada")
    }
  }
  typeCard(value){
    return OpenPay.card.cardType(value)
  }
}