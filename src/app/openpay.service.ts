import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { EcommerceService } from './ecommerce.service';

declare var OpenPay: any;
var charge
var ecommerceService

@Injectable({
  providedIn: 'root'
})
export class OpenpayService {
  constructor(public eService : EcommerceService) {
    ecommerceService = eService;
    OpenPay.setId(environment.OpenPay.merchant_id);
    OpenPay.setApiKey(environment.OpenPay.public_key);
    OpenPay.setSandboxMode(true);
  }

  public onSuccess(response){
    charge.source_id=response.data.id
    ecommerceService.postcharges(charge).subscribe(response => {
      console.log(response)
    })
  }
  onError(response) {
    alert('Fallo en la transacción');
    console.log(response)
  }
  CreateCharge(Cardinfo,Chargeinfo){
    if(OpenPay.card.validateCardNumber(Cardinfo.card_number) && OpenPay.card.validateCVC(Cardinfo.cvv2) && OpenPay.card.validateExpiry(Cardinfo.expiration_month, Cardinfo.expiration_year)){
      Chargeinfo.device_session_id=OpenPay.deviceData.setup("formId")
      charge=Chargeinfo
      OpenPay.token.create(Cardinfo, this.onSuccess, this.onError)
    }else{
      alert("Su tarjeta a sido denegada")
    }
  }
  typeCard(value){
    return OpenPay.card.cardType(value)
  }
}