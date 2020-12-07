import { Component, OnInit } from '@angular/core';
import { Router } from  "@angular/router";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EcommerceService } from '../ecommerce.service';
import { CookieService } from "ngx-cookie-service";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  title = 'Registro de Usuario';
  registroForm : FormGroup

  constructor(public ecommerceService : EcommerceService, public  router:  Router, private _builder : FormBuilder, private cookies: CookieService) { 
    this.registroForm = this._builder.group({
      Nombre : ['', Validators.required],
      Correo : ['', Validators.compose([Validators.email, Validators.required])],
      Password : ['', Validators.compose([Validators.pattern(/^(?=\w*\d)(?=\w*[A-Z])(?=\w*[a-z])\S{8,16}$/), Validators.required])],
      Passwordvalid : ['', Validators.compose([Validators.pattern(/^(?=\w*\d)(?=\w*[A-Z])(?=\w*[a-z])\S{8,16}$/), Validators.required])],
    })
  }

  ngOnInit(): void {
    this.ecommerceService.isLoggedin()
  }
  registrarse(values){
    if(values.Password==values.Passwordvalid){
      this.ecommerceService.createUser(values.Nombre, values.Correo.toLowerCase(), values.Password)
    }else{console.log("Las contraseñas no coinciden");alert("Las contraseñas no coinciden")}
  }
}
