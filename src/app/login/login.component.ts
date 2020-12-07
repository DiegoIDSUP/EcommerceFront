import { Component, OnInit } from '@angular/core';
import { Router } from  "@angular/router";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EcommerceService } from '../ecommerce.service';
import { CookieService } from "ngx-cookie-service";
import firebase from 'firebase/app';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
} )
export class LoginComponent implements OnInit {
  title = 'Iniciar Sesion';
  loginForm : FormGroup
  

  constructor(public ecommerceService : EcommerceService, public  router:  Router, private _builder : FormBuilder, private cookies: CookieService) {
    this.loginForm = this._builder.group({
      email : ['', Validators.compose([Validators.email, Validators.required])],
      password : ['',Validators.required],
    })
   }
  
  ngOnInit(): void {
    this.ecommerceService.isLoggedin()
  }
  Login(values){
    values.email=values.email.toLowerCase()
    this.ecommerceService.singInWithEmail(values)
  }
  signInWithGoogle(){
    let provider = new firebase.auth.GoogleAuthProvider();
    this.ecommerceService.signInWithSocial(provider,"Bearer google-oauth2 ")
  }
  signInWithFacebook(){
    let provider = new firebase.auth.FacebookAuthProvider();
    this.ecommerceService.signInWithSocial(provider,"Bearer facebook ")
  }
}
