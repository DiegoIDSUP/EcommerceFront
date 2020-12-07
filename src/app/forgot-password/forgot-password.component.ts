import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EcommerceService } from '../ecommerce.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {
  title = "Recuperar Contraseña"
  sendemail = false
  resetForm : FormGroup
  
  constructor(public ecommerceService : EcommerceService, private _builder : FormBuilder) { 
    this.resetForm = this._builder.group({
      Correo : ['', Validators.compose([Validators.email, Validators.required])],
    })
  }

  ngOnInit(): void {
    this.ecommerceService.isLoggedin()
  }

  resetPassword(value){
    this.sendemail = true
    this.ecommerceService.sendEmailResetPassword(value.Correo)

  }

}
