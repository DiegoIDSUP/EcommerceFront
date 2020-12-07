import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { EcommerceService } from '../ecommerce.service';

@Component({
  selector: 'app-verify-email',
  templateUrl: './verify-email.component.html',
  styleUrls: ['./verify-email.component.css']
})
export class VerifyEmailComponent implements OnInit {
  title = 'Verifica tu Cuenta'
  constructor(public ecommerceService : EcommerceService, public  router:  Router, private cookies: CookieService) { }

  ngOnInit(): void {
    this.ecommerceService.needLog()
    if(this.cookies.get("Usuario").length>0){
      if(JSON.parse(this.cookies.get("Usuario")).emailVerified){
        this.router.navigate(['/inicio'])
      }
    }
  }

}
