import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from  '@angular/forms'
import { HttpClientModule } from '@angular/common/http'
import { environment } from '../environments/environment';
import { CookieService } from 'ngx-cookie-service';

import { AppComponent } from './app.component';
import { InicioComponent } from './inicio/inicio.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { CarritoComponent } from './carrito/carrito.component';
import { ProductoComponent } from './producto/producto.component';
import { PerfilComponent } from './perfil/perfil.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { VerifyEmailComponent } from './verify-email/verify-email.component';
import { AppRoutingModule } from './app-routing.module';
import { EcommerceService } from './ecommerce.service';
import { OpenpayService } from './openpay.service';

import { AngularFireModule } from "@angular/fire";
import { AngularFireAuthModule } from "@angular/fire/auth";
import { PagarComponent } from './pagar/pagar.component';

@NgModule({
  declarations: [
    AppComponent,
    InicioComponent,
    LoginComponent,
    RegisterComponent,
    ForgotPasswordComponent,
    VerifyEmailComponent,
    CarritoComponent,
    ProductoComponent,
    PerfilComponent,
    PagarComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireAuthModule,
  ],
  providers: [EcommerceService,CookieService,OpenpayService],
  bootstrap: [AppComponent]
})
export class AppModule { }
