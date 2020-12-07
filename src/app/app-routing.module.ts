import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InicioComponent } from './inicio/inicio.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { CarritoComponent } from './carrito/carrito.component';
import { ProductoComponent } from './producto/producto.component';
import { PerfilComponent } from './perfil/perfil.component';
import { VerifyEmailComponent } from './verify-email/verify-email.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { PagarComponent } from './pagar/pagar.component';


const routes: Routes =[
  { path:'',redirectTo:'inicio',pathMatch:'full'},
  { path:  'inicio',component:  InicioComponent},
  { path:  'login',component:  LoginComponent},
  { path:  'registro', component:  RegisterComponent },
  { path:  'carrito',component:  CarritoComponent},
  { path:  'producto/:id', component:  ProductoComponent },
  { path:  'perfil', component:  PerfilComponent },
  { path:  'forgot-password', component:  ForgotPasswordComponent },
  { path:  'verify-email', component:  VerifyEmailComponent },
  { path:  'pagar', component:  PagarComponent },
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
