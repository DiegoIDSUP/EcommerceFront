import { Component, OnInit } from '@angular/core';
import { EcommerceService } from '../ecommerce.service';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent implements OnInit {
  title= "Ropa Artesanal"
  isLoggedin
  fill=true
  user
  productos
  constructor(public ecommerceService : EcommerceService, private cookies: CookieService) { }

  ngOnInit(): void {
    this.isLoggedin=false
    if(this.cookies.get("Token").length>0){
      this.isLoggedin=true
      this.user=JSON.parse(this.cookies.get("Usuario"))
    }
    this.ecommerceService.getsearch("productos","?show=true").subscribe(response => {
      this.productos= response
      if(this.productos.length<=0){
        this.fill=false
      }
    })
  }
}
